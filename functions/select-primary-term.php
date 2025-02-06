<?php
add_action('admin_head', 'add_primary_category_in_meta_box');
function add_primary_category_in_meta_box()
{
    global $pagenow, $post_type, $post;

    if (in_array($pagenow, ['post.php', 'post-new.php']) && $post_type === 'post') {
        $primary_category_id = get_post_meta($post->ID, 'primary_category', true);
?>
        <style>
            .primary-category-selector {
                padding: 10px;
                margin-top: 15px;
                border: 1px solid #ddd;
                background-color: #f9f9f9;
                border-radius: 4px;
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            .primary-category-selector.hidden {
                display: none;
            }
        </style>
        <script>
            jQuery(document).ready(function($) {
                const categoryBox = $('#categorydiv .inside');
                const primaryCategoryHTML = `
                    <div class="primary-category-selector hidden">
                        <label for="primary_category">Selecteer hoofdcategorie:</label>
                        <select name="primary_category" id="primary_category"></select>
                    </div>`;

                categoryBox.append(primaryCategoryHTML);

                const primaryCategorySelect = $('#primary_category');
                const primaryCategorySelector = $('.primary-category-selector');

                // Function to populate the dropdown based on selected categories
                function populatePrimaryCategory() {
                    const selectedCategories = $('#categorychecklist input:checked').map(function() {
                        return $(this).val();
                    }).get();

                    primaryCategorySelect.empty();
                    primaryCategorySelector.addClass('hidden');

                    // Add options for selected categories if more than one is selected
                    if (selectedCategories.length > 1) {
                        primaryCategorySelector.removeClass('hidden'); // Show if more than one category is selected
                        $.each(selectedCategories, function(index, categoryId) {
                            const categoryName = $('#categorychecklist li#category-' + categoryId + ' label').text().trim();
                            primaryCategorySelect.append(`<option value="${categoryId}">${categoryName}</option>`);
                        });

                        // Set the selected primary category
                        if (selectedCategories.includes('<?= esc_js($primary_category_id); ?>')) {
                            primaryCategorySelect.val('<?= esc_js($primary_category_id); ?>');
                        }
                    }
                }

                // Initial population of primary category dropdown
                populatePrimaryCategory();

                // Event listener for changes in category checkboxes
                $('#categorychecklist input').on('change', populatePrimaryCategory);
            });
        </script>
<?php
    }
}

// Save the primary category when the post is saved
add_action('save_post', 'save_primary_category');

function save_primary_category($post_id)
{
    if (isset($_POST['primary_category'])) {
        $primary_category_id = intval($_POST['primary_category']);
        update_post_meta($post_id, 'primary_category', $primary_category_id);
    }
}
