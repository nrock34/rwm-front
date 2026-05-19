(function (global) {
	"use strict";

	const BLOCK_META = {
		header: { label: "Header", icon: "H" },
		subtext: { label: "Subtext", icon: "T" },
		paragraph: { label: "Paragraph", icon: "P" },
		smallText: { label: "Small Note", icon: "N" },
		quote: { label: "Quote", icon: "Q" },
		image: { label: "Image", icon: "I" },
		embed: { label: "Embed", icon: "E" },
		slideshow: { label: "Slideshow", icon: "S" },
		poll: { label: "Poll", icon: "?" },
		layout: { label: "Layout", icon: "L" }
	};

	const EMBED_KINDS = ["spotify", "youtube", "map"];
	const TEXT_FONT_SIZES = ["sm", "md", "lg"];

	const MENU_PLUS_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
	const MENU_MOVE_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 7H17M7 12H17M7 17H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
	const MENU_EXTRACT_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 7H18M8 12H14M8 17H18M6 12L3 9M6 12L3 15M6 12H14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
	const MENU_SPACING_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4V20M8 8H16M8 16H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 4H18M6 20H18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity=".55"/></svg>';
	const MENU_IMAGE_BORDER_ICON = '<svg width="18" height="18" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 2.5h15v15h-15z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M6 6h8v8H6z" fill="currentColor" opacity=".22"/></svg>';
	const MENU_IMAGE_STRETCH_ICON = '<svg width="18" height="18" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M3 10h14M3 10l3-3M3 10l3 3M17 10l-3-3M17 10l-3 3" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
	const MENU_IMAGE_BACKGROUND_ICON = '<svg width="18" height="18" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect x="2.5" y="2.5" width="15" height="15" rx="2.5" fill="currentColor" opacity=".14"/><path d="M6 13l2.4-2.8 2.2 2.2 2.8-3.4L15 13H6z" fill="currentColor"/></svg>';

	function cloneValue(value) {
		return JSON.parse(JSON.stringify(value));
	}

	function createId(prefix) {
		if (global.crypto && typeof global.crypto.randomUUID === "function") {
			return prefix + "-" + global.crypto.randomUUID().slice(0, 8);
		}
		return prefix + "-" + Math.random().toString(36).slice(2, 10);
	}

	function normalizeMarginBottom(value) {
		return typeof value === "string" ? value.trim() : "";
	}

	function parseWidthValue(width) {
		const parsed = Number.parseFloat(String(width || "").replace(/fr$/i, "").trim());
		return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
	}

	function widthToRatio(width) {
		const rounded = Math.round(parseWidthValue(width) * 100) / 100;
		return String(rounded).replace(/\.0+$/, "").replace(/(\.\d*[1-9])0+$/, "$1") + "fr";
	}

	function toolIcon(type) {
		const letter = (BLOCK_META[type] && BLOCK_META[type].icon) || type.slice(0, 1).toUpperCase();
		return '<div style="display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:999px;border:1px solid rgba(202,209,220,0.95);font-size:11px;font-weight:700;">' + letter + "</div>";
	}

	function createInput(value, placeholder, disabled) {
		const input = document.createElement("input");
		input.type = "text";
		input.value = value || "";
		input.placeholder = placeholder || "";
		input.disabled = !!disabled;
		return input;
	}

	function createTextarea(value, placeholder, disabled) {
		const textarea = document.createElement("textarea");
		textarea.value = value || "";
		textarea.placeholder = placeholder || "";
		textarea.disabled = !!disabled;
		return textarea;
	}

	function createSelect(options, value, disabled) {
		const select = document.createElement("select");
		select.disabled = !!disabled;
		options.forEach((config) => {
			const option = document.createElement("option");
			option.value = config.value;
			option.textContent = config.label;
			option.selected = config.value === value;
			select.append(option);
		});
		return select;
	}

	function createField(labelText, control) {
		const field = document.createElement("div");
		field.className = "postcard-tool-field";
		const label = document.createElement("label");
		label.textContent = labelText;
		field.append(label, control);
		return field;
	}

	function createToolBody() {
		const body = document.createElement("div");
		body.className = "postcard-tool-body";
		return body;
	}

	function createBlockHeader(label, detail, chipText) {
		const header = document.createElement("div");
		header.className = "postcard-tool-header";

		const copy = document.createElement("div");
		copy.className = "postcard-tool-header-copy";

		const title = document.createElement("div");
		title.className = "postcard-tool-header-label";
		title.textContent = label;
		copy.append(title);

		if (detail) {
			const detailLine = document.createElement("div");
			detailLine.className = "postcard-tool-header-detail";
			detailLine.textContent = detail;
			copy.append(detailLine);
		}

		header.append(copy);

		const meta = document.createElement("div");
		meta.className = "postcard-tool-header-meta";

		if (chipText) {
			const chip = document.createElement("div");
			chip.className = "postcard-tool-header-chip";
			chip.textContent = chipText;
			meta.append(chip);
		}

		header.append(meta);
		header._meta = meta;
		return header;
	}

	function normalizeLayoutData(data) {
		const columns = Array.isArray(data && data.columns) ? data.columns : [];
		const nextColumns = columns
			.filter((column) => column && typeof column === "object")
			.map((column, columnIndex) => ({
				width: widthToRatio(column.width || "1fr"),
				style: typeof column.style === "string" ? column.style : undefined,
				blocks: Array.isArray(column.blocks)
					? column.blocks
						.filter((block) => block && typeof block === "object" && block.type !== "layout")
						.map((block, blockIndex) => normalizeBlock(block.type, block, "layout-" + columnIndex + "-" + blockIndex))
					: []
			}));

		return {
			mb: normalizeMarginBottom(data && data.mb),
			columns: nextColumns.length >= 2
				? nextColumns
				: [
					{ width: "1fr", blocks: nextColumns[0] ? nextColumns[0].blocks : [] },
					{ width: "1fr", blocks: nextColumns[1] ? nextColumns[1].blocks : [] }
				]
		};
	}

	function normalizeBlock(type, block, seed) {
		const baseId = block && typeof block.id === "string" && block.id.trim() ? block.id : createId(seed || type);
		const data = block && typeof block === "object" ? block.data || {} : {};
		const blockMarginBottom = normalizeMarginBottom((block && block.mb) || data.mb);

		switch (type) {
			case "header":
			case "subtext":
				return {
					id: baseId,
					type,
					mb: blockMarginBottom,
					data: {
						text: typeof data.text === "string" ? data.text : "",
						fontSize: TEXT_FONT_SIZES.includes(data.fontSize) ? data.fontSize : "md"
					}
				};
			case "paragraph":
			case "smallText":
				return {
					id: baseId,
					type,
					mb: blockMarginBottom,
					data: { text: typeof data.text === "string" ? data.text : "" }
				};
			case "quote":
				return {
					id: baseId,
					type,
					mb: blockMarginBottom,
					data: {
						text: typeof data.text === "string" ? data.text : "",
						attribution: typeof data.attribution === "string" ? data.attribution : ""
					}
				};
			case "image":
				return {
					id: baseId,
					type,
					mb: blockMarginBottom,
					data: {
						src: typeof data.src === "string" ? data.src : "",
						alt: typeof data.alt === "string" ? data.alt : "",
						caption: typeof data.caption === "string" ? data.caption : "",
						withBorder: data.withBorder === true,
						withBackground: data.withBackground === true,
						stretched: data.stretched === true
					}
				};
			case "embed":
				return {
					id: baseId,
					type,
					mb: blockMarginBottom,
					data: {
						kind: EMBED_KINDS.includes(data.kind) ? data.kind : "spotify",
						url: typeof data.url === "string" ? data.url : "",
						caption: typeof data.caption === "string" ? data.caption : ""
					}
				};
			case "slideshow":
				return {
					id: baseId,
					type,
					mb: blockMarginBottom,
					data: {
						slides: Array.isArray(data.slides) && data.slides.length > 0
							? data.slides.map((slide) => ({
								src: typeof (slide && slide.src) === "string" ? slide.src : "",
								alt: typeof (slide && slide.alt) === "string" ? slide.alt : "",
								caption: typeof (slide && slide.caption) === "string" ? slide.caption : ""
							}))
							: [{ src: "", alt: "", caption: "" }]
					}
				};
			case "poll":
				return {
					id: baseId,
					type,
					mb: blockMarginBottom,
					data: {
						question: typeof data.question === "string" ? data.question : "",
						options: Array.isArray(data.options) && data.options.length > 0
							? data.options.map((option, index) => ({
								id: option && typeof option.id === "string" && option.id.trim() ? option.id : createId("option-" + (index + 1)),
								label: option && typeof option.label === "string" ? option.label : ""
							}))
							: [
								{ id: createId("option-1"), label: "" },
								{ id: createId("option-2"), label: "" }
							]
					}
				};
			case "layout":
				return {
					id: baseId,
					type,
					mb: blockMarginBottom,
					data: normalizeLayoutData(data)
				};
			default:
				return normalizeBlock("paragraph", block, seed);
		}
	}

	function validateBlockData(type, data) {
		switch (type) {
			case "header":
			case "subtext":
				return typeof data.text === "string" && data.text.trim().length > 0 && (!data.fontSize || TEXT_FONT_SIZES.includes(data.fontSize));
			case "paragraph":
			case "smallText":
				return typeof data.text === "string" && data.text.trim().length > 0;
			case "quote":
				return typeof data.text === "string" && data.text.trim().length > 0;
			case "image":
				return typeof data.src === "string" && data.src.trim().length > 0;
			case "embed":
				return EMBED_KINDS.includes(data.kind) && typeof data.url === "string" && data.url.trim().length > 0;
			case "slideshow":
				return Array.isArray(data.slides) && data.slides.length > 0 && data.slides.every((slide) => typeof slide.src === "string" && slide.src.trim().length > 0);
			case "poll":
				return typeof data.question === "string" && data.question.trim().length > 0 && Array.isArray(data.options) && data.options.length >= 2 && data.options.every((option) => typeof option.label === "string" && option.label.trim().length > 0);
			case "layout":
				return Array.isArray(data.columns) && data.columns.length >= 2 && data.columns.every((column) => Array.isArray(column.blocks) && column.blocks.length > 0 && column.blocks.every((block) => block.type !== "layout"));
			default:
				return false;
		}
	}

	function renderSlidesEditor(container, slides, readOnly) {
		const list = document.createElement("div");
		list.className = "postcard-list";
		list.dataset.role = "slides-list";

		function addSlideCard(slide) {
			const card = document.createElement("div");
			card.className = "postcard-card";
			card.dataset.role = "slide-card";
			card.append(
				createField("Image URL", createInput(slide.src, "https://...", readOnly)),
				createField("Alt text", createInput(slide.alt, "Optional alt text", readOnly)),
				createField("Caption", createTextarea(slide.caption, "Caption on image", readOnly))
			);

			if (!readOnly) {
				const removeButton = document.createElement("button");
				removeButton.type = "button";
				removeButton.className = "ghost postcard-mini-button";
				removeButton.textContent = "Remove slide";
				removeButton.addEventListener("click", () => {
					card.remove();
					if (!list.children.length) {
						addSlideCard({ src: "", alt: "", caption: "" });
					}
				});
				card.append(removeButton);
			}

			list.append(card);
		}

		slides.forEach((slide) => addSlideCard(slide));
		container.append(list);

		if (!readOnly) {
			const addButton = document.createElement("button");
			addButton.type = "button";
			addButton.className = "ghost postcard-mini-button";
			addButton.textContent = "Add slide";
			addButton.addEventListener("click", () => addSlideCard({ src: "", alt: "", caption: "" }));
			container.append(addButton);
		}
	}

	function renderPollOptions(container, options, readOnly) {
		const list = document.createElement("div");
		list.className = "postcard-list";
		list.dataset.role = "poll-options";

		function addOptionCard(option) {
			const row = document.createElement("div");
			row.className = "postcard-card";
			row.dataset.role = "poll-option";
			row.dataset.optionId = option.id;
			row.append(createField("Option label", createInput(option.label, "Option text", readOnly)));

			if (!readOnly) {
				const removeButton = document.createElement("button");
				removeButton.type = "button";
				removeButton.className = "ghost postcard-mini-button";
				removeButton.textContent = "Remove option";
				removeButton.addEventListener("click", () => {
					row.remove();
					if (list.children.length < 2) {
						addOptionCard({ id: createId("option"), label: "" });
					}
				});
				row.append(removeButton);
			}

			list.append(row);
		}

		options.forEach((option) => addOptionCard(option));
		container.append(list);

		if (!readOnly) {
			const addButton = document.createElement("button");
			addButton.type = "button";
			addButton.className = "ghost postcard-mini-button";
			addButton.textContent = "Add option";
			addButton.addEventListener("click", () => addOptionCard({ id: createId("option"), label: "" }));
			container.append(addButton);
		}
	}

	function renderStandaloneFields(type, data, readOnly, tool) {
		const wrapper = document.createElement("div");
		wrapper.className = "postcard-tool";
		wrapper.dataset.blockType = type;
		const body = createToolBody();
		let header;

		switch (type) {
			case "header": {
				header = createBlockHeader("Header", "Standalone section heading block.", data.fontSize || "md");
				const fontSizeSelect = createSelect([
					{ value: "sm", label: "Small" },
					{ value: "md", label: "Medium" },
					{ value: "lg", label: "Large" }
				], data.fontSize || "md", readOnly);
				body.append(
					createField("Text", createTextarea(data.text, "Section header", readOnly)),
					createField("Font size", fontSizeSelect)
				);
				break;
			}
			case "subtext": {
				header = createBlockHeader("Subtext", "Supporting copy that can sit under a heading.", data.fontSize || "md");
				const fontSizeSelect = createSelect([
					{ value: "sm", label: "Small" },
					{ value: "md", label: "Medium" },
					{ value: "lg", label: "Large" }
				], data.fontSize || "md", readOnly);
				body.append(
					createField("Text", createTextarea(data.text, "Supporting subtext", readOnly)),
					createField("Font size", fontSizeSelect)
				);
				break;
			}
			case "paragraph":
				header = createBlockHeader("Paragraph", "Primary body copy for the article section.");
				body.append(createField("Text", createTextarea(data.text, "Write here…", readOnly)));
				break;
			case "smallText":
				header = createBlockHeader("Small Note", "Secondary copy for asides, context, or lighter notes.");
				body.append(createField("Text", createTextarea(data.text, "Write here…", readOnly)));
				break;
			case "quote":
				header = createBlockHeader("Quote", "Pull quote or testimonial block.", data.attribution ? "Attributed" : "No source");
				body.append(
					createField("Quote", createTextarea(data.text, "Quote text", readOnly)),
					createField("Attribution", createInput(data.attribution, "Source or speaker", readOnly))
				);
				break;
			case "image": {
				header = createBlockHeader("Image", "Single editorial image with caption and image tunes.", data.src ? "Configured" : "Empty");
				body.append(
					createField("Image URL", createInput(data.src, "https://...", readOnly)),
					createField("Alt text", createInput(data.alt, "Accessible alt text", readOnly)),
					createField("Caption", createTextarea(data.caption, "Caption on image", readOnly))
				);
				break;
			}
			case "embed": {
				header = createBlockHeader("Embed", "External media or map block.", data.kind || "spotify");
				const kindSelect = createSelect(
					EMBED_KINDS.map((kind) => ({ value: kind, label: kind })),
					data.kind || "spotify",
					readOnly
				);
				body.append(
					createField("Embed type", kindSelect),
					createField("Embed URL", createInput(data.url, "https://...", readOnly)),
					createField("Caption", createTextarea(data.caption, "Context or caption", readOnly))
				);
				break;
			}
			case "slideshow":
				header = createBlockHeader("Slideshow", "One slideshow block containing multiple slides.", String(data.slides && data.slides.length || 0) + " slides");
				renderSlidesEditor(body, data.slides || [], readOnly);
				break;
			case "poll":
				header = createBlockHeader("Poll", "Interactive poll block with answer options.", String(data.options && data.options.length || 0) + " options");
				body.append(createField("Question", createTextarea(data.question, "Question", readOnly)));
				renderPollOptions(body, data.options || [], readOnly);
				break;
			default:
				header = createBlockHeader("Paragraph", "Primary body copy for the article section.");
				body.append(createField("Text", createTextarea(data.text, "Write here…", readOnly)));
		}

		wrapper.append(header, body);
		if (tool && typeof tool.decorateToolChrome === "function") {
			tool.decorateToolChrome({ header, body, wrapper, type });
		}

		return wrapper;
	}

	function collectStandaloneData(type, root, currentMb) {
		const fields = root.querySelectorAll(".postcard-tool-field");
		const readField = (index) => {
			const control = fields[index] && fields[index].querySelector("input, textarea, select");
			return control && typeof control.value === "string" ? control.value.trim() : "";
		};
		const mb = normalizeMarginBottom(currentMb);

		switch (type) {
			case "header":
			case "subtext":
				return { text: readField(0), fontSize: readField(1) || "md", mb };
			case "paragraph":
			case "smallText":
				return { text: readField(0), mb };
			case "quote":
				return { text: readField(0), attribution: readField(1), mb };
			case "image":
				return { src: readField(0), alt: readField(1), caption: readField(2), mb };
			case "embed":
				return { kind: readField(0) || "spotify", url: readField(1), caption: readField(2), mb };
			case "slideshow":
				return {
					slides: Array.from(root.querySelectorAll('[data-role="slide-card"]')).map((card) => {
						const controls = card.querySelectorAll("input, textarea");
						return {
							src: controls[0] ? controls[0].value.trim() : "",
							alt: controls[1] ? controls[1].value.trim() : "",
							caption: controls[2] ? controls[2].value.trim() : ""
						};
					}),
					mb
				};
			case "poll":
				return {
					question: readField(0),
					options: Array.from(root.querySelectorAll('[data-role="poll-option"]')).map((card) => ({
						id: card.dataset.optionId || createId("option"),
						label: card.querySelector("input") ? card.querySelector("input").value.trim() : ""
					})),
					mb
				};
			default:
				return { text: readField(0), mb };
		}
	}

	class BasePostcardTool {
		static get isReadOnlySupported() {
			return true;
		}

		static get enableLineBreaks() {
			return true;
		}

		constructor(args) {
			this.api = args.api;
			this.config = args.config || {};
			this.readOnly = args.readOnly;
			this.block = args.block;
			this.wrapper = null;
			this.data = {};
		}

		getCurrentBlockIndex() {
			return this.api.blocks && this.api.blocks.getCurrentBlockIndex ? this.api.blocks.getCurrentBlockIndex() : -1;
		}

		getCurrentBlockId() {
			return this.block && this.block.id ? this.block.id : null;
		}

		getMovementActions() {
			if (this.readOnly || !this.config.controller) {
				return [];
			}

			if (this.config.surface === "layout") {
				return [{
					icon: MENU_EXTRACT_ICON,
					label: "Extract to article",
					onActivate: async () => {
						if (this.api.toolbar && this.api.toolbar.close) {
							this.api.toolbar.close();
						}
						await this.config.controller.extractLayoutBlockToArticle({
							layoutId: this.config.layoutId,
							columnIndex: this.config.columnIndex,
							childBlockId: this.getCurrentBlockId(),
							childIndex: this.getCurrentBlockIndex()
						});
					}
				}];
			}

			return this.config.controller.listLayoutTargets().flatMap((target) =>
				target.columns.map((columnLabel, columnIndex) => ({
					icon: MENU_MOVE_ICON,
					label: "Move to " + target.label + " / " + columnLabel,
					onActivate: async () => {
						if (this.api.toolbar && this.api.toolbar.close) {
							this.api.toolbar.close();
						}
						await this.config.controller.moveTopLevelBlockToLayout({
							sourceBlockId: this.getCurrentBlockId(),
							layoutId: target.id,
							columnIndex
						});
					}
				}))
			);
		}

		getSpacingActions() {
			if (this.readOnly || !this.data || typeof this.data !== "object") {
				return [];
			}

			const currentMargin = normalizeMarginBottom(this.data.mb);
			return [{
				icon: MENU_SPACING_ICON,
				label: currentMargin ? "Set margin bottom (" + currentMargin + ")" : "Set margin bottom",
				onActivate: () => {
					const nextValue = global.prompt(
						"Set a custom block margin bottom. Use Tailwind spacing classes like mb-8 or arbitrary values like mb-[3.25rem]. Leave blank to clear.",
						currentMargin
					);

					if (nextValue === null) {
						return;
					}

					this.data.mb = normalizeMarginBottom(nextValue);
					if (this.api.toolbar && this.api.toolbar.close) {
						this.api.toolbar.close();
					}
				}
			}];
		}

		renderSettings() {
			return this.getSpacingActions().concat(this.getMovementActions());
		}

		decorateToolChrome(args) {
			if (!args.header || !args.body) {
				return;
			}

			const collapseButton = document.createElement("button");
			collapseButton.type = "button";
			collapseButton.className = "ghost postcard-mini-button postcard-tool-collapse";
			collapseButton.textContent = "Collapse";
			collapseButton.addEventListener("click", () => {
				const nextHidden = !args.body.hidden;
				args.body.hidden = nextHidden;
				collapseButton.textContent = nextHidden ? "Expand" : "Collapse";
			});
			args.header._meta.append(collapseButton);
		}
	}

	function createTextTool(type, toolboxTitle) {
		return class extends BasePostcardTool {
			static get toolbox() {
				return { title: toolboxTitle, icon: toolIcon(type) };
			}

			constructor(args) {
				super(args);
				this.data = normalizeBlock(type, { data: args.data, mb: args.data && args.data.mb }, type).data;
				this.data.mb = normalizeMarginBottom(args.data && args.data.mb);
			}

			render() {
				this.wrapper = renderStandaloneFields(type, this.data, this.readOnly, this);
				return this.wrapper;
			}

			save(blockContent) {
				return collectStandaloneData(type, blockContent, this.data.mb);
			}

			validate(data) {
				return validateBlockData(type, data);
			}
		};
	}

	const HeaderTool = createTextTool("header", "Header");
	const SubtextTool = createTextTool("subtext", "Subtext");
	const ParagraphTool = createTextTool("paragraph", "Paragraph");
	const SmallTextTool = createTextTool("smallText", "Small Note");
	const QuoteTool = createTextTool("quote", "Quote");

	class ImageTool extends BasePostcardTool {
		static get toolbox() {
			return { title: "Image", icon: toolIcon("image") };
		}

		constructor(args) {
			super(args);
			this.data = normalizeBlock("image", { data: args.data, mb: args.data && args.data.mb }, "image").data;
			this.data.mb = normalizeMarginBottom(args.data && args.data.mb);
			this.settings = [
				{ name: "withBorder", label: "Add border", icon: MENU_IMAGE_BORDER_ICON },
				{ name: "stretched", label: "Stretch block", icon: MENU_IMAGE_STRETCH_ICON },
				{ name: "withBackground", label: "Add background", icon: MENU_IMAGE_BACKGROUND_ICON }
			];
		}

		render() {
			const wrapper = renderStandaloneFields("image", this.data, this.readOnly, this);
			wrapper.classList.add("postcard-image-tool");

			const preview = document.createElement("figure");
			preview.className = "postcard-image-tool-preview";

			const previewImage = document.createElement("img");
			previewImage.className = "postcard-image-tool-preview-image";
			previewImage.alt = this.data.alt || "Postcard image preview";
			if (this.data.src) {
				previewImage.src = this.data.src;
			}

			const previewCaption = document.createElement("figcaption");
			previewCaption.className = "postcard-image-tool-preview-caption";
			previewCaption.textContent = this.data.caption || "Image caption preview";
			preview.append(previewImage, previewCaption);

			const urlInput = wrapper.querySelectorAll(".postcard-tool-field input")[0];
			const altInput = wrapper.querySelectorAll(".postcard-tool-field input")[1];
			const captionInput = wrapper.querySelector(".postcard-tool-field textarea");

			urlInput.addEventListener("input", () => {
				previewImage.src = urlInput.value.trim();
			});
			altInput.addEventListener("input", () => {
				previewImage.alt = altInput.value.trim() || "Postcard image preview";
			});
			captionInput.addEventListener("input", () => {
				previewCaption.textContent = captionInput.value.trim() || "Image caption preview";
			});

			wrapper.append(preview);
			this.wrapper = wrapper;
			this.applyTuneView();
			this.applyStretch();
			return wrapper;
		}

		save(blockContent) {
			const fields = blockContent.querySelectorAll(".postcard-tool-field");
			return {
				src: fields[0] && fields[0].querySelector("input") ? fields[0].querySelector("input").value.trim() : "",
				alt: fields[1] && fields[1].querySelector("input") ? fields[1].querySelector("input").value.trim() : "",
				caption: fields[2] && fields[2].querySelector("textarea") ? fields[2].querySelector("textarea").value.trim() : "",
				withBorder: !!this.data.withBorder,
				withBackground: !!this.data.withBackground,
				stretched: !!this.data.stretched,
				mb: normalizeMarginBottom(this.data.mb)
			};
		}

		validate(data) {
			return validateBlockData("image", data);
		}

		renderSettings() {
			const tuneActions = this.settings.map((tune) => ({
				icon: tune.icon,
				label: tune.label,
				isActive: !!this.data[tune.name],
				onActivate: () => this.toggleTune(tune.name)
			}));

			return tuneActions.concat(this.getSpacingActions(), this.getMovementActions());
		}

		toggleTune(tuneName) {
			this.data[tuneName] = !this.data[tuneName];
			this.applyTuneView();
			if (tuneName === "stretched") {
				this.applyStretch();
			}
		}

		applyStretch() {
			if (typeof this.api.blocks.stretchBlock === "function") {
				const currentIndex = this.getCurrentBlockIndex();
				if (currentIndex >= 0) {
					this.api.blocks.stretchBlock(currentIndex, !!this.data.stretched);
				}
			}
		}

		applyTuneView() {
			if (!this.wrapper) {
				return;
			}
			this.wrapper.classList.toggle("withBorder", !!this.data.withBorder);
			this.wrapper.classList.toggle("withBackground", !!this.data.withBackground);
			this.wrapper.classList.toggle("stretched", !!this.data.stretched);
		}
	}

	class EmbedTool extends BasePostcardTool {
		static get toolbox() {
			return { title: "Embed", icon: toolIcon("embed") };
		}

		constructor(args) {
			super(args);
			this.data = normalizeBlock("embed", { data: args.data, mb: args.data && args.data.mb }, "embed").data;
			this.data.mb = normalizeMarginBottom(args.data && args.data.mb);
		}

		render() {
			this.wrapper = renderStandaloneFields("embed", this.data, this.readOnly, this);
			return this.wrapper;
		}

		save(blockContent) {
			return collectStandaloneData("embed", blockContent, this.data.mb);
		}

		validate(data) {
			return validateBlockData("embed", data);
		}
	}

	class SlideshowTool extends BasePostcardTool {
		static get toolbox() {
			return { title: "Slideshow", icon: toolIcon("slideshow") };
		}

		constructor(args) {
			super(args);
			this.data = normalizeBlock("slideshow", { data: args.data, mb: args.data && args.data.mb }, "slideshow").data;
			this.data.mb = normalizeMarginBottom(args.data && args.data.mb);
		}

		render() {
			this.wrapper = renderStandaloneFields("slideshow", this.data, this.readOnly, this);
			return this.wrapper;
		}

		save(blockContent) {
			return collectStandaloneData("slideshow", blockContent, this.data.mb);
		}

		validate(data) {
			return validateBlockData("slideshow", data);
		}
	}

	class PollTool extends BasePostcardTool {
		static get toolbox() {
			return { title: "Poll", icon: toolIcon("poll") };
		}

		constructor(args) {
			super(args);
			this.data = normalizeBlock("poll", { data: args.data, mb: args.data && args.data.mb }, "poll").data;
			this.data.mb = normalizeMarginBottom(args.data && args.data.mb);
		}

		render() {
			this.wrapper = renderStandaloneFields("poll", this.data, this.readOnly, this);
			return this.wrapper;
		}

		save(blockContent) {
			return collectStandaloneData("poll", blockContent, this.data.mb);
		}

		validate(data) {
			return validateBlockData("poll", data);
		}
	}

	class PostcardLayoutTool extends BasePostcardTool {
		static get isReadOnlySupported() {
			return true;
		}

		static get enableLineBreaks() {
			return true;
		}

		static get toolbox() {
			return { title: "Layout", icon: toolIcon("layout") };
		}

		constructor(args) {
			super(args);
			this.data = normalizeLayoutData(args.data || {});
			this.data.mb = normalizeMarginBottom(args.data && args.data.mb);
			this.wrapper = document.createElement("div");
			this.wrapper.className = "postcard-layout-tool";
			this.columnEditors = [];
			this.columnHolders = [];
			this.columnState = cloneValue(this.data.columns);
			this.layoutId = args.block && args.block.id ? args.block.id : createId("layout");
		}

		render() {
			this.renderUi();
			return this.wrapper;
		}

		async save() {
			const columns = await this.collectColumns();
			this.data = normalizeLayoutData({ columns });
			this.data.mb = normalizeMarginBottom(this.data.mb);
			return { columns: cloneValue(this.data.columns), mb: this.data.mb };
		}

		validate(data) {
			return validateBlockData("layout", data);
		}

		renderSettings() {
			const actions = [
				{
					label: "Add column",
					onActivate: () => {
						this.captureColumnWidths();
						this.columnState.push({ width: "1fr", blocks: [] });
						this.rebalanceWidths();
						this.renderUi();
						this.api.toolbar.close();
					}
				},
				{
					label: "Rebalance widths",
					onActivate: () => {
						this.captureColumnWidths();
						this.rebalanceWidths();
						this.renderUi();
						this.api.toolbar.close();
					}
				},
				{
					label: "2 columns",
					onActivate: () => {
						this.captureColumnWidths();
						this.setColumnCount(2);
						this.api.toolbar.close();
					}
				},
				{
					label: "3 columns",
					onActivate: () => {
						this.captureColumnWidths();
						this.setColumnCount(3);
						this.api.toolbar.close();
					}
				},
				{
					label: "4 columns",
					onActivate: () => {
						this.captureColumnWidths();
						this.setColumnCount(4);
						this.api.toolbar.close();
					}
				}
			];

			return actions.map((action) => ({
				icon: MENU_PLUS_ICON,
				label: action.label,
				onActivate: action.onActivate
			})).concat(this.getSpacingActions());
		}

		async destroyNestedEditors() {
			await Promise.all(this.columnEditors.map(async (editor) => {
				if (editor && editor.save) {
					try {
						await editor.save();
					} catch (error) {
						void error;
					}
				}
				if (editor && editor.destroy) {
					editor.destroy();
				}
			}));
			this.columnEditors = [];
			this.columnHolders = [];
		}

		rebalanceWidths() {
			this.columnState = this.columnState.map((column) => ({ ...column, width: "1fr" }));
		}

		setColumnCount(nextCount) {
			const target = Math.max(2, Math.min(4, nextCount));
			while (this.columnState.length < target) {
				this.columnState.push({ width: "1fr", blocks: [] });
			}
			if (this.columnState.length > target) {
				const overflow = this.columnState.splice(target);
				this.columnState[target - 1].blocks.push(...overflow.flatMap((column) => column.blocks));
			}
			this.rebalanceWidths();
			this.renderUi();
		}

		captureColumnWidths() {
			const widthInputs = this.wrapper.querySelectorAll(".postcard-layout-width");
			this.columnState = this.columnState.map((column, index) => ({
				...column,
				width: widthToRatio(widthInputs[index] ? widthInputs[index].value : (column.width || "1fr"))
			}));
		}

		updateColumnFlex() {
			this.wrapper.querySelectorAll(".postcard-layout-column").forEach((column, index) => {
				column.style.flex = String(parseWidthValue(this.columnState[index] ? this.columnState[index].width : "1fr")) + " 1 0px";
			});
		}

		async collectColumns() {
			const savedColumns = await Promise.all(this.columnEditors.map(async (editor, index) => {
				const saved = await editor.save();
				const blocks = Array.isArray(saved && saved.blocks)
					? saved.blocks.map((block, blockIndex) => normalizeBlock(block && block.type, block, "layout-" + index + "-" + blockIndex))
					: [];
				return {
					width: widthToRatio(this.wrapper.querySelectorAll(".postcard-layout-width")[index] ? this.wrapper.querySelectorAll(".postcard-layout-width")[index].value : "1fr"),
					blocks
				};
			}));

			return savedColumns.length >= 2
				? savedColumns
				: [
					{ width: "1fr", blocks: savedColumns[0] ? savedColumns[0].blocks : [] },
					{ width: "1fr", blocks: savedColumns[1] ? savedColumns[1].blocks : [] }
				];
		}

		createResizer(leftIndex, rightIndex) {
			const handle = document.createElement("div");
			handle.className = "postcard-layout-resizer";
			if (this.readOnly) {
				return handle;
			}

			handle.addEventListener("pointerdown", (event) => {
				event.preventDefault();
				const widthInputs = this.wrapper.querySelectorAll(".postcard-layout-width");
				const leftInput = widthInputs[leftIndex];
				const rightInput = widthInputs[rightIndex];
				const leftStart = parseWidthValue(leftInput && leftInput.value);
				const rightStart = parseWidthValue(rightInput && rightInput.value);
				const startX = event.clientX;
				const rootBounds = this.wrapper.querySelector(".postcard-layout-columns").getBoundingClientRect();
				const rootWidth = Math.max(rootBounds.width || 1, 1);
				const total = leftStart + rightStart;

				const move = (moveEvent) => {
					const deltaRatio = ((moveEvent.clientX - startX) / rootWidth) * total * 3;
					const nextLeft = Math.max(0.5, leftStart + deltaRatio);
					const nextRight = Math.max(0.5, total - nextLeft);
					leftInput.value = widthToRatio(nextLeft);
					rightInput.value = widthToRatio(nextRight);
					this.columnState[leftIndex].width = leftInput.value;
					this.columnState[rightIndex].width = rightInput.value;
					this.updateColumnFlex();
				};

				const end = () => {
					global.removeEventListener("pointermove", move);
					global.removeEventListener("pointerup", end);
				};

				global.addEventListener("pointermove", move);
				global.addEventListener("pointerup", end);
			});

			return handle;
		}

		renderColumn(column, index) {
			const columnEl = document.createElement("section");
			columnEl.className = "postcard-layout-column";
			columnEl.style.flex = String(parseWidthValue(column.width)) + " 1 0px";

			const header = document.createElement("div");
			header.className = "postcard-layout-column-header";

			const title = document.createElement("div");
			title.className = "postcard-layout-column-title";
			title.textContent = "Column " + (index + 1);

			const controls = document.createElement("div");
			controls.className = "postcard-layout-column-controls";

			const widthInput = createInput(column.width, "1fr", this.readOnly);
			widthInput.className = "postcard-layout-width";
			widthInput.addEventListener("input", () => {
				widthInput.value = widthToRatio(widthInput.value || "1fr");
				this.columnState[index].width = widthInput.value;
				this.updateColumnFlex();
			});

			const removeButton = document.createElement("button");
			removeButton.type = "button";
			removeButton.className = "ghost postcard-mini-button";
			removeButton.textContent = "Remove";
			removeButton.disabled = !!this.readOnly || this.columnState.length <= 2;
			removeButton.addEventListener("click", async () => {
				if (this.columnState.length <= 2) {
					return;
				}
				const latestColumns = await this.collectColumns();
				const destinationIndex = index === 0 ? 1 : index - 1;
				latestColumns[destinationIndex].blocks.push(...latestColumns[index].blocks);
				latestColumns.splice(index, 1);
				this.columnState = latestColumns.map((current) => ({ ...current, width: "1fr" }));
				this.renderUi();
			});

			controls.append(widthInput, removeButton);
			header.append(title, controls);

			const body = document.createElement("div");
			body.className = "postcard-layout-body";
			body.dataset.columnIndex = String(index);

			const holder = document.createElement("div");
			holder.id = createId("layout-column-editor");
			holder.className = "postcard-layout-editor-holder";
			body.append(holder);
			this.columnHolders[index] = holder;

			columnEl.append(header, body);
			return columnEl;
		}

		async mountNestedEditors() {
			const EditorJS = (this.config && this.config.EditorJS) || global.EditorJS;
			await Promise.all(this.columnState.map(async (column, index) => {
				const holder = this.columnHolders[index];
				if (!holder || !EditorJS) {
					return;
				}
				const nestedEditor = new EditorJS({
					holder,
					autofocus: false,
					minHeight: 80,
					readOnly: this.readOnly,
					tools: createPostcardTools({
						surface: "layout",
						controller: this.config.controller,
						layoutId: this.layoutId,
						columnIndex: index,
						EditorJS
					}),
					data: {
						time: Date.now(),
						version: "postcard-layout-column",
						blocks: column.blocks
					}
				});
				this.columnEditors[index] = nestedEditor;
				if (nestedEditor.isReady) {
					await nestedEditor.isReady;
				}
			}));
		}

		async renderUi() {
			await this.destroyNestedEditors();
			this.wrapper.innerHTML = "";

			const header = createBlockHeader(
				"Layout",
				"Multi-column container that holds native Editor.js blocks in each column.",
				String(this.columnState.length) + " columns"
			);
			header.classList.add("postcard-layout-block-header");
			this.wrapper.append(header);

			const columnsRow = document.createElement("div");
			columnsRow.className = "postcard-layout-columns";
			this.columnState.forEach((column, index) => {
				columnsRow.append(this.renderColumn(column, index));
				if (index < this.columnState.length - 1) {
					columnsRow.append(this.createResizer(index, index + 1));
				}
			});

			this.wrapper.append(columnsRow);
			this.updateColumnFlex();
			void this.mountNestedEditors();
		}

		destroy() {
			void this.destroyNestedEditors();
		}
	}

	function createPostcardTools(context) {
		const tools = {
			header: { class: HeaderTool, config: context || {} },
			subtext: { class: SubtextTool, config: context || {} },
			paragraph: { class: ParagraphTool, config: context || {} },
			smallText: { class: SmallTextTool, config: context || {} },
			quote: { class: QuoteTool, config: context || {} },
			image: { class: ImageTool, config: context || {} },
			embed: { class: EmbedTool, config: context || {} },
			slideshow: { class: SlideshowTool, config: context || {} },
			poll: { class: PollTool, config: context || {} }
		};

		if (!context || context.surface !== "layout") {
			tools.layout = { class: PostcardLayoutTool, config: context || {} };
		}

		return tools;
	}

	global.PostcardEditorPlugin = {
		createPostcardTools,
		normalizeBlock,
		normalizeLayoutData,
		validateBlockData,
		HeaderTool,
		SubtextTool,
		ParagraphTool,
		SmallTextTool,
		QuoteTool,
		ImageTool,
		EmbedTool,
		SlideshowTool,
		PollTool,
		PostcardLayoutTool
	};
})(window);
