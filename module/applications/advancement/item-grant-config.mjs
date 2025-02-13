import AdvancementConfig from "./advancement-config.mjs";

/**
 * Configuration application for item grants.
 */
export default class ItemGrantConfig extends AdvancementConfig {
  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      dragDrop: [{ dropSelector: ".drop-target" }],
      dropKeyPath: "items",
      template: "systems/sw5e/templates/advancement/item-grant-config.hbs"
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();
    context.showPowerConfig = context.configuration.items.map(fromUuidSync).some(i => i.type === "power");
    return context;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  _validateDroppedItem(event, item) {
    if (this.advancement.constructor.VALID_TYPES.has(item.type)) return true;
    const type = game.i18n.localize(`ITEM.Type${item.type.capitalize()}`);
    throw new Error(game.i18n.format("SW5E.AdvancementItemTypeInvalidWarning", { type }));
  }
}
