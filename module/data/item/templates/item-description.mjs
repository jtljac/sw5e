/**
 * Data model template with item description & source.
 *
 * @property {object} description               Various item descriptions.
 * @property {string} description.value         Full item description.
 * @property {string} description.chat          Description displayed in chat card.
 * @property {string} description.unidentified  Description displayed if item is unidentified.
 * @property {string} source                    Adventure or sourcebook where this item originated.
 * @mixin
 */
export default class ItemDescriptionTemplate extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    return {
      description: new foundry.data.fields.SchemaField({
        value: new foundry.data.fields.HTMLField({required: true, nullable: true, label: "SW5E.Description"}),
        chat: new foundry.data.fields.HTMLField({required: true, nullable: true, label: "SW5E.DescriptionChat"}),
        unidentified: new foundry.data.fields.HTMLField({
          required: true, nullable: true, label: "SW5E.DescriptionUnidentified"
        })
      }),
      source: new foundry.data.fields.StringField({required: true, label: "SW5E.Source"})
    };
  }

  /* -------------------------------------------- */
  /*  Migrations                                  */
  /* -------------------------------------------- */

  /** @inheritdoc */
  static migrateData(source) {
    ItemDescriptionTemplate.#migrateSource(source);
  }

  /* -------------------------------------------- */

  /**
   * Convert null source to the blank string.
   * @param {object} source  The candidate source data from which the model will be constructed.
   */
  static #migrateSource(source) {
    if ( source.source === null ) source.source = "";
  }
}
