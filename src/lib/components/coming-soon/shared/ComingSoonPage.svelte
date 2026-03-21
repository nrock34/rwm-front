<script>
    import NewsletterFormCS from "../NewsletterFormCS.svelte";

    let {
        form,
        backgroundClass = "",
        badgeIcon: BadgeIcon,
        badgeText = "",
        badgeClass = "",
        titleLead = "",
        titleHighlight = "",
        titleHighlightClass = "",
        description = "",
        primaryCtaHref = "#signup",
        primaryCtaLabel = "Get Updates",
        primaryCtaClass = "",
        primaryCtaIcon: PrimaryCtaIcon,
        secondaryCtaHref = "/",
        secondaryCtaLabel = "Explore",
        secondaryCtaClass = "btn-secondary text-lg px-8 py-4",
        heroAddon,
        middleSection,
        features = [],
        featuresTitle = "",
        featuresDescription = "",
        featuresSectionClass = "",
        featureIconContainerClass = "bg-primary/10",
        featureIconClass = "text-primary",
        featureBadgeClass = "bg-primary/10 text-primary",
        afterFeaturesSection,
        signupId = "signup",
        signupSectionClass = "",
        signupTitle = "",
        signupDescription = "",
        signupFootnote = ""
    } = $props();
</script>

<div class={`min-h-screen ${backgroundClass}`}>
    <section class="py-16 lg:py-20">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <div class={`mb-6 inline-flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-medium ${badgeClass}`}>
                    {#if BadgeIcon}
                        <BadgeIcon class="h-4 w-4" />
                    {/if}
                    <span>{badgeText}</span>
                </div>

                <h1 class="mb-6 text-4xl font-bold text-foreground lg:text-6xl">
                    {titleLead}
                    <span class={`block ${titleHighlightClass}`}>{titleHighlight}</span>
                </h1>

                <p class="mx-auto mb-8 max-w-3xl text-xl text-muted-foreground">{description}</p>

                <div class="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
                    <a href={primaryCtaHref} class={`inline-flex items-center justify-center rounded-md px-8 py-4 text-lg ${primaryCtaClass}`}>
                        {#if PrimaryCtaIcon}
                            <PrimaryCtaIcon class="mr-2 h-5 w-5" />
                        {/if}
                        {primaryCtaLabel}
                    </a>
                    <a href={secondaryCtaHref} class={secondaryCtaClass}>{secondaryCtaLabel}</a>
                </div>

                {#if heroAddon}
                    {@render heroAddon()}
                {/if}
            </div>
        </div>
    </section>

    {#if middleSection}
        {@render middleSection()}
    {/if}

    <section class={`py-16 ${featuresSectionClass}`}>
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="mb-12 text-center">
                <h2 class="mb-4 text-3xl font-bold text-foreground">{featuresTitle}</h2>
                <p class="mx-auto max-w-2xl text-muted-foreground">{featuresDescription}</p>
            </div>

            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {#each features as feature}
                    {@const IconComponent = feature.icon}
                    <div class="card p-6 text-center transition-shadow hover:shadow-lg">
                        <div class={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${feature.iconContainerClass ?? featureIconContainerClass}`}>
                            {#if IconComponent}
                                <IconComponent class={`h-6 w-6 ${feature.iconClass ?? featureIconClass}`} />
                            {/if}
                        </div>
                        <h3 class="mb-2 font-semibold text-foreground">{feature.title}</h3>
                        <p class="mb-3 text-sm text-muted-foreground">{feature.description}</p>
                        {#if feature.preview || feature.count}
                            <span class={`rounded px-2 py-1 text-xs font-medium ${feature.badgeClass ?? featureBadgeClass}`}>
                                {feature.preview ?? feature.count}
                            </span>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
    </section>

    {#if afterFeaturesSection}
        {@render afterFeaturesSection()}
    {/if}

    <section id={signupId} class={`py-16 ${signupSectionClass}`}>
        <div class="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 class="mb-4 text-3xl font-bold">{signupTitle}</h2>
            <p class="mb-8 text-xl opacity-90">{signupDescription}</p>

            <div class="mx-auto max-w-2xl">
                <NewsletterFormCS {form} />
            </div>

            {#if signupFootnote}
                <p class="mt-4 text-xs opacity-90">{signupFootnote}</p>
            {/if}
        </div>
    </section>
</div>
