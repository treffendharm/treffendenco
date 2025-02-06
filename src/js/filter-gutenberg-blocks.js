// This code is used to only allow the selected blocks to be used only on by us selected blocks.

// Define which blocks are allowed in which parent blocks
const allowedBlocksConfig = {
    'acf/text': [
        'core/paragraph',
        'core/heading',
        'core/list'
    ],
    'acf/image-row': [
        'core/image'
    ]
};

function addParentAttribute(settings, name) {
    // Find which parent blocks allow this block type
    const allowedParents = Object.entries(allowedBlocksConfig)
        .filter(([_, allowedBlocks]) => allowedBlocks.includes(name))
        .map(([parent]) => parent);

    // If this block isn't allowed in any parents, return unchanged
    if (allowedParents.length === 0) {
        return settings;
    }

    return {
        ...settings,
        parent: allowedParents
    };
}

wp.hooks.addFilter(
    'blocks.registerBlockType',
    'treffend/parent-settings',
    addParentAttribute
);
