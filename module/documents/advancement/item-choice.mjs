import ItemGrantAdvancement from "./item-grant.mjs";
import ItemChoiceConfig from "../../applications/advancement/item-choice-config.mjs";
import ItemChoiceFlow from "../../applications/advancement/item-choice-flow.mjs";
import ItemChoiceConfigurationData from "../../data/advancement/item-choice.mjs";

/**
 * Advancement that presents the player with a choice of multiple items that they can take. Keeps track of which
 * items were selected at which levels.
 */
export default class ItemChoiceAdvancement extends ItemGrantAdvancement {

  /** @inheritdoc */
  static get metadata() {
    return foundry.utils.mergeObject(super.metadata, {
      dataModels: {
        configuration: ItemChoiceConfigurationData
      },
      order: 50,
      icon: "systems/sw5e/icons/svg/item-choice.svg",
      title: game.i18n.localize("SW5E.AdvancementItemChoiceTitle"),
      hint: game.i18n.localize("SW5E.AdvancementItemChoiceHint"),
      multiLevel: true,
      apps: {
        config: ItemChoiceConfig,
        flow: ItemChoiceFlow
      }
    });
  }

  /* -------------------------------------------- */
  /*  Instance Properties                         */
  /* -------------------------------------------- */

  /** @inheritdoc */
  get levels() {
    return Array.from(Object.keys(this.configuration.choices));
  }

  /* -------------------------------------------- */
  /*  Display Methods                             */
  /* -------------------------------------------- */

  /** @inheritdoc */
  configuredForLevel(level) {
    return this.value.added?.[level] !== undefined;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  titleForLevel(level, { configMode=false }={}) {
    return `${this.title} <em>(${game.i18n.localize("SW5E.AdvancementChoices")})</em>`;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  summaryForLevel(level, { configMode=false }={}) {
    const items = this.value.added?.[level];
    if ( !items || configMode ) return "";
    return Object.values(items).reduce((html, uuid) => html + game.sw5e.utils.linkForUuid(uuid), "");
  }

  /* -------------------------------------------- */
  /*  Application Methods                         */
  /* -------------------------------------------- */

  /** @inheritdoc */
  storagePath(level) {
    return `value.added.${level}`;
  }

  /* -------------------------------------------- */

  /**
   * Verify that the provided item can be used with this advancement based on the configuration.
   * @param {Item5e} item                   Item that needs to be tested.
   * @param {object} config
   * @param {string} config.type            Type restriction on this advancement.
   * @param {object} config.restriction     Additional restrictions to be applied.
   * @param {boolean} [config.strict=true]  Should an error be thrown when an invalid type is encountered?
   * @returns {boolean}                     Is this type valid?
   * @throws An error if the item is invalid and strict is `true`.
   */
  _validateItemType(item, { type, restriction, strict=true }={}) {
    super._validateItemType(item, { strict });
    type ??= this.configuration.type;
    restriction ??= this.configuration.restriction;

    // Type restriction is set and the item type does not match the selected type
    if ( type && (type !== item.type) ) {
      const typeLabel = game.i18n.localize(CONFIG.Item.typeLabels[restriction]);
      if ( strict ) throw new Error(game.i18n.format("SW5E.AdvancementItemChoiceTypeWarning", {type: typeLabel}));
      return false;
    }

    // If additional type restrictions applied, make sure they are valid
    if ( (type === "feat") && restriction.type ) {
      const typeConfig = CONFIG.SW5E.featureTypes[restriction.type];
      const subtype = typeConfig.subtypes?.[restriction.subtype];
      let errorLabel;
      if ( restriction.type !== item.system.type.value ) errorLabel = typeConfig.label;
      else if ( subtype && (restriction.subtype !== item.system.type.subtype) ) errorLabel = subtype;
      if ( errorLabel ) {
        if ( strict ) throw new Error(game.i18n.format("SW5E.AdvancementItemChoiceTypeWarning", {type: errorLabel}));
        return false;
      }
    }

    // If power level is restricted, ensure the power is of the appropriate level
    const l = parseInt(restriction.level);
    if ( (type === "power") && !Number.isNaN(l) && (item.system.level !== l) ) {
      const level = CONFIG.SW5E.powerLevels[l];
      if ( strict ) throw new Error(game.i18n.format("SW5E.AdvancementItemChoicePowerLevelSpecificWarning", {level}));
      return false;
    }

    return true;
  }
}
