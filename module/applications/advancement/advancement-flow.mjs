/**
 * Base class for the advancement interface displayed by the advancement prompt that should be subclassed by
 * individual advancement types.
 *
 * @param {Item5e} item           Item to which the advancement belongs.
 * @param {string} advancementId  ID of the advancement this flow modifies.
 * @param {number} level          Level for which to configure this flow.
 * @param {object} [options={}]   Application rendering options.
 */
export default class AdvancementFlow extends FormApplication {
  constructor(item, advancementId, level, options = {}) {
    super({}, options);

    /**
     * The item that houses the Advancement.
     * @type {Item5e}
     */
    this.item = item;

    /**
     * ID of the advancement this flow modifies.
     * @type {string}
     * @private
     */
    this._advancementId = advancementId;

    /**
     * Level for which to configure this flow.
     * @type {number}
     */
    this.level = level;

    /**
     * Data retained by the advancement manager during a reverse step. If restoring data using Advancement#restore,
     * this data should be used when displaying the flow's form.
     * @type {object|null}
     */
    this.retainedData = null;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: "systems/sw5e/templates/advancement/advancement-flow.hbs",
      popOut: false
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  get id() {
    return `actor-${this.advancement.item.id}-advancement-${this.advancement.id}-${this.level}`;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  get title() {
    return this.advancement.title;
  }

  /* -------------------------------------------- */

  /**
   * The Advancement object this flow modifies.
   * @type {Advancement|null}
   */
  get advancement() {
    return this.item.advancement?.byId[this._advancementId] ?? null;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    return {
      appId: this.id,
      advancement: this.advancement,
      type: this.advancement.constructor.typeName,
      title: this.title,
      summary: this.advancement.summaryForLevel(this.level),
      level: this.level
    };
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async _updateObject(event, formData) {
    await this.advancement.apply(this.level, formData);
  }
}
