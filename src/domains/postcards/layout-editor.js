import { assertPostcardEditorDocument, POSTCARD_EDITOR_FORMAT, POSTCARD_EDITOR_VERSION } from "./contracts.js";

export const POSTCARD_LAYOUT_EDITOR_APPLY_EVENT = "postcard-layout-editor:apply";

const POSTCARD_EDITOR_PLUGIN_SCRIPT_PATH = "/postcards/postcard-editorjs-plugin.js";
const POSTCARD_EDITOR_PLUGIN_STYLES_PATH = "/postcards/postcard-editorjs-plugin.css";
const EDITOR_JS_UMD_URL = "https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest/dist/editorjs.umd.js";

/**
 * @template T
 * @param {T} value
 * @returns {T}
 */
function cloneValue(value) {
	return /** @type {T} */ (JSON.parse(JSON.stringify(value)));
}

/**
 * @param {string} [prefix]
 * @returns {string}
 */
function createId(prefix = "block") {
	return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * @param {unknown} value
 * @returns {string | undefined}
 */
function normalizeMarginBottom(value) {
	if (typeof value !== "string") {
		return undefined;
	}

	const trimmed = value.trim();
	return trimmed || undefined;
}

/**
 * @param {any} block
 * @returns {any}
 */
function injectEditorBlockMargins(block) {
	const nextBlock = /** @type {any} */ (cloneValue(block));
	const nextMb = normalizeMarginBottom(nextBlock.mb);

	if (nextBlock.type === "layout") {
		nextBlock.data = {
			...nextBlock.data,
			...(nextMb ? { mb: nextMb } : {}),
			columns: nextBlock.data.columns.map(/** @param {any} column */ (column) => ({
				...column,
				blocks: column.blocks.map(injectEditorBlockMargins)
			}))
		};
	} else {
		nextBlock.data = {
			...nextBlock.data,
			...(nextMb ? { mb: nextMb } : {})
		};
	}

	return nextBlock;
}

/**
 * @param {any} block
 * @param {number} index
 * @returns {any}
 */
function restoreEditorBlockMargins(block, index) {
	const restoredBlock = /** @type {any} */ ({
		id: typeof block?.id === "string" && block.id.trim() ? block.id.trim() : createId(`block-${index + 1}`),
		type: typeof block?.type === "string" ? block.type : "paragraph",
		data: cloneValue(block?.data ?? {})
	});

	const dataMb = normalizeMarginBottom(restoredBlock.data?.mb);
	if (restoredBlock.data && typeof restoredBlock.data === "object" && "mb" in restoredBlock.data) {
		delete restoredBlock.data.mb;
	}

	if (restoredBlock.type === "layout" && Array.isArray(restoredBlock.data?.columns)) {
		restoredBlock.data.columns = restoredBlock.data.columns.map(
			/** @param {any} column @param {number} columnIndex */ (column, columnIndex) => ({
				...column,
				blocks: Array.isArray(column?.blocks)
					? column.blocks.map(
						/** @param {any} childBlock @param {number} childIndex */ (childBlock, childIndex) =>
							restoreEditorBlockMargins(childBlock, columnIndex * 100 + childIndex)
					)
					: []
			})
		);
	}

	const rootMb = normalizeMarginBottom(block?.mb);
	return {
		...restoredBlock,
		...(rootMb || dataMb ? { mb: rootMb ?? dataMb } : {})
	};
}

/**
 * @param {import("./types.js").PostcardEditorDocument} document
 * @returns {{ time: number; version: string; blocks: import("./types.js").PostcardEditorBlock[] }}
 */
export function buildPostcardLayoutEditorData(document) {
	return {
		time: Date.now(),
		version: "postcard-editor-preview",
		blocks: /** @type {import("./types.js").PostcardEditorBlock[]} */ (document.blocks.map(injectEditorBlockMargins))
	};
}

/**
 * @param {{ blocks?: { id?: unknown; type?: unknown; data?: unknown }[] } | null | undefined} editorData
 * @returns {import("./types.js").PostcardEditorDocument}
 */
export function buildPostcardDocumentFromLayoutEditorData(editorData) {
	const blocks = /** @type {import("./types.js").PostcardEditorBlock[]} */ (Array.isArray(editorData?.blocks)
		? editorData.blocks.map((block, index) => restoreEditorBlockMargins(block, index))
		: []);

	return assertPostcardEditorDocument({
		format: POSTCARD_EDITOR_FORMAT,
		version: POSTCARD_EDITOR_VERSION,
		blocks
	});
}

/**
 * @param {import("./types.js").PostcardEditorDocument} document
 * @param {{ title?: string; channelId?: string }} [options]
 * @returns {string}
 */
export function buildPostcardLayoutEditorHtml(document, options = {}) {
	const editorData = buildPostcardLayoutEditorData(document);
	const serializedData = JSON.stringify(editorData).replace(/</g, "\\u003c");
	const resolvedTitle = options.title ?? "Postcard editor";
	const popupTitle = JSON.stringify(resolvedTitle);
	const channelId = JSON.stringify(options.channelId ?? "");

	return `<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>${resolvedTitle}</title>
	<link rel="stylesheet" href="${POSTCARD_EDITOR_PLUGIN_STYLES_PATH}" />
	<style>
		:root {
			color-scheme: light;
			font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
			background: #f5f6f8;
			color: #172033;
		}
		* {
			box-sizing: border-box;
		}
		body {
			margin: 0;
			background: linear-gradient(180deg, #f6f7fa 0%, #eef1f6 100%);
			color: #172033;
		}
		.shell {
			max-width: 1680px;
			margin: 0 auto;
			padding: 20px 16px 40px;
		}
		.topbar {
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			gap: 24px;
			margin-bottom: 18px;
		}
		.heading {
			display: grid;
			gap: 8px;
		}
		.kicker {
			font-size: 0.7rem;
			font-weight: 800;
			letter-spacing: 0.14em;
			text-transform: uppercase;
			color: #64748b;
		}
		h1 {
			margin: 0;
			font-size: 1.4rem;
			line-height: 1.15;
		}
		p {
			margin: 0;
			line-height: 1.55;
			color: #51607a;
			max-width: 64rem;
		}
		.controls {
			display: flex;
			gap: 12px;
			flex-wrap: wrap;
			justify-content: flex-end;
		}
		button {
			border: 0;
			border-radius: 999px;
			background: #f05a28;
			color: white;
			padding: 11px 16px;
			font: inherit;
			font-weight: 600;
			cursor: pointer;
			box-shadow: 0 10px 24px rgba(240, 90, 40, 0.22);
		}
		button.secondary {
			background: white;
			color: #172033;
			box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
		}
		button.ghost {
			background: rgba(255,255,255,0.72);
			color: #172033;
			box-shadow: none;
			border: 1px solid rgba(202, 209, 220, 0.95);
		}
		.panel {
			background: rgba(255, 255, 255, 0.92);
			border: 1px solid rgba(202, 209, 220, 0.9);
			border-radius: 20px;
			padding: 14px;
			box-shadow: 0 18px 44px rgba(15, 23, 42, 0.08);
			overflow: visible;
		}
		#editorjs {
			min-height: 620px;
			padding-inline: 42px 10px;
			overflow: visible;
		}
		.note {
			margin-top: 10px;
			font-size: 0.84rem;
			color: #64748b;
		}
		.error {
			margin-top: 12px;
			padding: 12px 14px;
			border-radius: 14px;
			border: 1px solid rgba(248, 113, 113, 0.35);
			background: rgba(254, 242, 242, 0.95);
			color: #991b1b;
			font-size: 0.9rem;
		}
		.ce-block__content,
		.ce-toolbar__content {
			max-width: min(1600px, calc(100vw - 72px)) !important;
		}
		.ce-block {
			padding-block: 8px;
		}
		.ce-block + .ce-block {
			border-top: 1px solid rgba(226, 232, 240, 0.95);
			margin-top: 8px;
		}
		.codex-editor__redactor {
			padding-bottom: 24px !important;
		}
		.ce-toolbar__plus,
		.ce-toolbar__settings-btn {
			color: #475569;
		}
		.ce-toolbar,
		.ce-toolbar__actions,
		.ce-settings,
		.ce-popover,
		.ce-conversion-toolbar {
			z-index: 40;
		}
		.codex-editor,
		.codex-editor__redactor,
		.ce-block,
		.ce-block__content {
			overflow: visible !important;
		}
		pre {
			margin-top: 16px;
			padding: 18px;
			background: #101826;
			color: #d8e1f0;
			border-radius: 18px;
			overflow: auto;
			font-size: 12px;
			line-height: 1.7;
		}
	</style>
</head>
<body>
	<div class="shell">
		<div class="topbar">
			<div class="heading">
				<div class="kicker">Postcard Editor</div>
				<h1>${resolvedTitle}</h1>
				<p>This popup now uses the shared Editor.js postcard plugin bundle, so the preview editor and the Django admin can run the same block tools.</p>
			</div>
			<div class="controls">
				<button id="save-json" class="secondary" type="button">Show current JSON</button>
				<button id="apply-layout" type="button">Apply to postcard preview</button>
				<button id="close-editor" class="ghost" type="button">Close</button>
			</div>
		</div>
		<div class="panel">
			<div id="editorjs"></div>
			<p class="note">Top-level content and nested layout columns both come from the same postcard tool registry. Layout move/extract actions only target layouts currently visible in this editor.</p>
			<div id="editor-error" class="error" hidden></div>
			<pre id="editor-output" hidden></pre>
		</div>
	</div>
	<script src="${EDITOR_JS_UMD_URL}"></script>
	<script src="${POSTCARD_EDITOR_PLUGIN_SCRIPT_PATH}"></script>
	<script>
		(() => {
			const seedData = ${serializedData};
			const title = ${popupTitle};
			const channelId = ${channelId};
			const output = document.getElementById("editor-output");
			const errorBox = document.getElementById("editor-error");
			const plugin = window.PostcardEditorPlugin;
			const EditorJS = window.EditorJS;

			function showError(message) {
				errorBox.hidden = false;
				errorBox.textContent = message;
			}

			if (!plugin || !EditorJS || typeof plugin.createPostcardTools !== "function" || typeof plugin.normalizeBlock !== "function") {
				showError("The shared postcard Editor.js plugin could not be loaded. Make sure /postcards/postcard-editorjs-plugin.js and Editor.js are available.");
				return;
			}

			const normalizeBlock = plugin.normalizeBlock;
			const createPostcardTools = plugin.createPostcardTools;

			function findLayoutContextLabel(blocks, layoutIndex) {
				for (let index = layoutIndex - 1; index >= 0; index -= 1) {
					const block = blocks[index];
					if (!block || typeof block !== "object") {
						continue;
					}

					if (block.type === "layout") {
						break;
					}

					const text = typeof block.data?.text === "string" ? block.data.text.trim() : "";
					if ((block.type === "header" || block.type === "subtext") && text) {
						return text;
					}
				}

				return "";
			}

			function summarizeLayoutTarget(block, layoutIndex, blocks) {
				const layoutId = typeof block?.id === "string" && block.id.trim() ? block.id.trim() : "layout-" + (layoutIndex + 1);
				const normalizedLayout = normalizeBlock("layout", block, layoutId);
				const contextualLabel = findLayoutContextLabel(blocks, layoutIndex);

				return {
					id: layoutId,
					label: contextualLabel || "Layout " + (layoutIndex + 1),
					detail: String(normalizedLayout.data.columns.length) + " columns"
				};
			}

			const editorController = {
				editor: null,
				visibleLayouts: [],
				isRebuilding: false,

				listLayoutTargets() {
					return this.visibleLayouts;
				},

				syncVisibleLayouts(editorData) {
					const blocks = Array.isArray(editorData?.blocks) ? editorData.blocks : [];
					this.visibleLayouts = blocks
						.map((block, index) => ({ block, index }))
						.filter(({ block }) => block?.type === "layout")
						.map(({ block, index }, layoutIndex) => summarizeLayoutTarget(block, layoutIndex, blocks));
				},

				async rebuildEditor(nextData) {
					if (this.isRebuilding) {
						return;
					}

					this.isRebuilding = true;
					this.syncVisibleLayouts(nextData);

					try {
						if (this.editor?.destroy) {
							this.editor.destroy();
						}

						const holder = document.getElementById("editorjs");
						if (holder) {
							holder.innerHTML = "";
						}

						await new Promise((resolve) => window.requestAnimationFrame(resolve));
						await mountEditor(nextData);
					} finally {
						this.isRebuilding = false;
					}
				},

				async moveTopLevelBlockToLayout({ sourceBlockId, layoutId, columnIndex }) {
					if (this.isRebuilding) {
						return;
					}

					const saved = await getFreshEditorData();
					if (!Array.isArray(saved?.blocks) || !sourceBlockId) {
						return;
					}

					const sourceIndex = saved.blocks.findIndex((block) => block?.id === sourceBlockId);
					if (sourceIndex < 0) {
						return;
					}

					const [sourceBlock] = saved.blocks.splice(sourceIndex, 1);
					const layoutBlock = saved.blocks.find((block) => block?.id === layoutId && block?.type === "layout");
					if (!layoutBlock) {
						saved.blocks.splice(sourceIndex, 0, sourceBlock);
						return;
					}

					const normalizedLayout = normalizeBlock("layout", layoutBlock, layoutId);
					if (!normalizedLayout.data.columns[columnIndex]) {
						saved.blocks.splice(sourceIndex, 0, sourceBlock);
						return;
					}

					normalizedLayout.data.columns[columnIndex].blocks.push(normalizeBlock(sourceBlock.type, sourceBlock, sourceBlock.id));
					layoutBlock.data = normalizedLayout.data;
					await this.rebuildEditor(saved);
				},

				async extractLayoutBlockToArticle({ layoutId, columnIndex, childBlockId, childIndex }) {
					if (this.isRebuilding) {
						return;
					}

					const saved = await getFreshEditorData();
					if (!Array.isArray(saved?.blocks)) {
						return;
					}

					const layoutIndex = saved.blocks.findIndex((block) => block?.id === layoutId && block?.type === "layout");
					if (layoutIndex < 0) {
						return;
					}

					const layoutBlock = normalizeBlock("layout", saved.blocks[layoutIndex], layoutId);
					const column = layoutBlock.data.columns[columnIndex];
					const resolvedChildIndex = typeof childBlockId === "string" && childBlockId
						? column?.blocks.findIndex((block) => block.id === childBlockId) ?? -1
						: childIndex;

					if (!column || column.blocks.length <= 1 || resolvedChildIndex < 0 || resolvedChildIndex >= column.blocks.length) {
						if (column && column.blocks.length <= 1) {
							window.alert("A layout column needs at least one block.");
						}
						return;
					}

					const [extractedBlock] = column.blocks.splice(resolvedChildIndex, 1);
					saved.blocks[layoutIndex].data = layoutBlock.data;
					saved.blocks.splice(layoutIndex + 1, 0, extractedBlock);
					await this.rebuildEditor(saved);
				}
			};

			async function mountEditor(data = seedData) {
				editorController.syncVisibleLayouts(data);
				editorController.editor = new EditorJS({
					holder: "editorjs",
					autofocus: true,
					data,
					tools: createPostcardTools({
						surface: "root",
						controller: editorController,
						EditorJS
					})
				});

				if (editorController.editor?.isReady) {
					await editorController.editor.isReady;
				}
			}

			async function getFreshEditorData() {
				return editorController.editor ? await editorController.editor.save() : seedData;
			}

			void mountEditor();
			document.title = title;

			document.getElementById("save-json").addEventListener("click", async () => {
				const saved = await getFreshEditorData();
				output.hidden = false;
				output.textContent = JSON.stringify(saved, null, 2);
			});

			document.getElementById("apply-layout").addEventListener("click", async () => {
				const saved = await getFreshEditorData();
				if (window.opener) {
					window.opener.postMessage(
						{
							type: "${POSTCARD_LAYOUT_EDITOR_APPLY_EVENT}",
							channelId,
							editorData: saved
						},
						"*"
					);
				}
			});

			document.getElementById("close-editor").addEventListener("click", () => {
				window.close();
			});
		})();
	</script>
</body>
</html>`;
}

/**
 * @param {import("./types.js").PostcardEditorDocument} document
 * @param {{ title?: string; onSave?: (document: import("./types.js").PostcardEditorDocument) => void }} [options]
 * @returns {boolean}
 */
export function openPostcardLayoutEditor(document, options = {}) {
	if (typeof window === "undefined") {
		return false;
	}

	const channelId = globalThis.crypto?.randomUUID?.() ?? `postcard-layout-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
	let cleanup = () => {};

	if (typeof options.onSave === "function") {
		const onSave = options.onSave;
		/** @param {MessageEvent} event */
		const handleMessage = (event) => {
			if (event.data?.type !== POSTCARD_LAYOUT_EDITOR_APPLY_EVENT || event.data?.channelId !== channelId) {
				return;
			}

			const nextDocument = buildPostcardDocumentFromLayoutEditorData(event.data.editorData);
			onSave(nextDocument);
		};

		window.addEventListener("message", handleMessage);
		cleanup = () => {
			window.removeEventListener("message", handleMessage);
		};
	}

	const popup = window.open("", "_blank", "popup,width=1380,height=900");
	if (!popup) {
		cleanup();
		return false;
	}

	popup.document.title = "Opening postcard editor...";
	popup.document.body.innerHTML = `
		<div style="font-family: Inter, ui-sans-serif, system-ui, sans-serif; padding: 32px; color: #172033; background: #f6f7fa;">
			<p style="margin: 0; font-size: 16px;">Opening postcard editor…</p>
		</div>
	`;

	const html = buildPostcardLayoutEditorHtml(document, {
		title: options.title,
		channelId
	});
	const blobUrl = URL.createObjectURL(new Blob([html], { type: "text/html" }));
	popup.location.href = blobUrl;

	const closeWatcher = window.setInterval(() => {
		if (!popup.closed) {
			return;
		}

		window.clearInterval(closeWatcher);
		cleanup();
	}, 700);

	return true;
}
