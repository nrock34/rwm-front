/**
 * @typedef {{
 *   src: string;
 *   alt?: string;
 *   caption?: string;
 * }} PostcardEditorSlide
 */

/**
 * @typedef {{
 *   id: string;
 *   mb?: string;
 *   type: "header";
 *   data: { text: string; fontSize?: "sm" | "md" | "lg" };
 * }} PostcardHeaderBlock
 */

/**
 * @typedef {{
 *   id: string;
 *   mb?: string;
 *   type: "subtext";
 *   data: { text: string; fontSize?: "sm" | "md" | "lg" };
 * }} PostcardSubtextBlock
 */

/**
 * @typedef {{
 *   id: string;
 *   mb?: string;
 *   type: "paragraph";
 *   data: { text: string };
 * }} PostcardParagraphBlock
 */

/**
 * @typedef {{
 *   id: string;
 *   mb?: string;
 *   type: "smallText";
 *   data: { text: string };
 * }} PostcardSmallTextBlock
 */

/**
 * @typedef {{
 *   id: string;
 *   mb?: string;
 *   type: "image";
 *   data: {
 *     src: string;
 *     alt?: string;
 *     caption?: string;
 *     withBorder?: boolean;
 *     withBackground?: boolean;
 *     stretched?: boolean;
 *   };
 * }} PostcardImageBlock
 */

/**
 * @typedef {{
 *   id: string;
 *   mb?: string;
 *   type: "quote";
 *   data: { text: string; attribution?: string };
 * }} PostcardQuoteBlock
 */

/**
 * @typedef {{
 *   id: string;
 *   mb?: string;
 *   type: "embed";
 *   data: { kind: "spotify" | "youtube" | "map"; url: string; caption?: string };
 * }} PostcardEmbedBlock
 */

/**
 * @typedef {{
 *   id: string;
 *   mb?: string;
 *   type: "slideshow";
 *   data: { slides: PostcardEditorSlide[] };
 * }} PostcardSlideshowBlock
 */

/**
 * @typedef {{
 *   id: string;
 *   mb?: string;
 *   type: "poll";
 *   data: { question: string; options: { id: string; label: string }[] };
 * }} PostcardPollBlock
 */

/**
 * @typedef {PostcardHeaderBlock | PostcardSubtextBlock | PostcardParagraphBlock | PostcardSmallTextBlock | PostcardImageBlock | PostcardQuoteBlock | PostcardEmbedBlock | PostcardSlideshowBlock | PostcardPollBlock} PostcardLayoutChildBlock
 */

/**
 * @typedef {{
 *   width?: string;
 *   style?: string;
 *   blocks: PostcardLayoutChildBlock[];
 * }} PostcardLayoutColumn
 */

/**
 * @typedef {{
 *   id: string;
 *   mb?: string;
 *   type: "layout";
 *   data: { style?: string; columns: PostcardLayoutColumn[] };
 * }} PostcardLayoutBlock
 */

/**
 * @typedef {PostcardLayoutChildBlock | PostcardLayoutBlock} PostcardEditorBlock
 */

/**
 * @typedef {{
 *   format: "editorjs";
 *   version: 1;
 *   blocks: PostcardEditorBlock[];
 * }} PostcardEditorDocument
 */

export {};
