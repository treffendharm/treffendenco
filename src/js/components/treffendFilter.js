jQuery(($) => {

    const ajaxUrl = "/wp-admin/admin-ajax.php";
    const endpoint = "filter_post_type";

    // Add the selected filter span functionality
    const selectedFilterSpan = document.querySelector('.selected-filter');
    const filterLinks = document.querySelectorAll('.filter__category');

    // Update selected filter text based on current URL on page load
    const currentUrl = window.location.href;
    filterLinks.forEach(link => {
        if (link.href === currentUrl) {
            link.classList.add('active');
            const categoryName = link.getAttribute('data-category');
            selectedFilterSpan.textContent = categoryName === 'all' ? 'Alles' : categoryName;
        }
    });

    function ajaxCall(postType, category, taxonomy, page, argumentsArray = false, exclude = false, searchTerm = '') {
        console.log(postType, category, taxonomy, page, argumentsArray, exclude, searchTerm);

        $.ajax({
            type: "POST",
            url: ajaxUrl,
            dataType: "html",
            data: {
                action: endpoint,
                postType: postType,
                category: category,
                taxonomy: taxonomy,
                is_page: page,
                argumentsArray: argumentsArray,
                exclude: exclude,
                search: searchTerm,
            },
            beforeSend: function () {
                handleBeforeSend();
            },
            success: function (response) {
                handleSuccess(response);
            },
            error: function (errorThrown) {
                console.log('oops');
                console.log(errorThrown);
            },
        });
    }

    function updateUrl(page, category, searchTerm = '') {
        var currentUrl = new URL(window.location.href);
        var params = new URLSearchParams(currentUrl.search);
        params.set("is_page", page);

        if (category !== undefined && category !== null && category !== '') {
            params.set("category", category);
        } else {
            params.delete("category");
        }


        if (searchTerm !== '') {
            params.set("search", searchTerm);
        } else {
            params.delete("search");
        }

        currentUrl.search = params;
        window.history.replaceState({}, "", currentUrl.href);
    }


    // Handlers
    function handleBeforeSend() {
        $("#posts_wrapper").animate({
            // opacity: 0,
        }, 300);

        setTimeout(function () {
            // remove the page- class and set it again with the new page on the wrapper
            var urlParams = new URLSearchParams(window.location.search);
            var page = urlParams.get('is_page');
            $("#posts_wrapper").removeClass(function (index, className) {
                return (className.match(/(^|\s)page-\S+/g) || []).join(' ');
            });
            $("#posts_wrapper").addClass('page-' + page);
        }, 280);


        // Scroll to the top
        $("html, body").animate({
            scrollTop: 101,
        }, 200);
    }

    function handleSuccess(response) {
        var jsonRes = JSON.parse(response);
        var postItems = jsonRes.html;
        var pagination = jsonRes.pagination;

        // Update posts
        $("#posts_wrapper").html(Array.isArray(postItems) ? postItems[0] : postItems);

        // Update pagination
        if (pagination !== false && $(".pagination").length) {
            $(".pagination").html(pagination).animate({ opacity: 1 }, 300);
        } else {
            $(".pagination").animate({ opacity: 0 }, 300);
        }

        $("#posts_wrapper").animate({ opacity: 1 }, 300);
    }

    function getCategories() {
        var urlParams = new URLSearchParams(window.location.search);
        var category = urlParams.get('category');
        if (category === null) {
            category = 'all';
        }
        return category;
    }

    function handleFilterToggle() {
        $('#js-filter-toggle').on('click', function() {
            const wrapper = $('#js-filter-wrapper');
            const isOpen = wrapper.attr('data-open') === 'true';
            wrapper.attr('data-open', (!isOpen).toString());
        });
    }

    function categoryClick() {
        // check if there is a category in the url
        var urlParams = new URLSearchParams(window.location.search);
        var category = urlParams.get('category');
        if (category !== null) {
            $('.filter__category').removeClass('active');
            $('.filter__category[data-category="' + category + '"]').addClass('active');
            // Update selected filter text
            selectedFilterSpan.textContent = category === 'all' ? 'Alles' : category;
        }

        $(document).on('click', '.filter__category', function (e) {
            e.preventDefault();

            var postType = $("#posts_wrapper").data("post_type");
            var taxonomy = $("#posts_wrapper").data("taxonomy");
            var exclude = $("#posts_wrapper").data("exclude");
            var category = $(this).data('category');
            
            // Update selected filter text
            selectedFilterSpan.textContent = category === 'all' ? 'Alles' : category;
            console.log(selectedFilterSpan.textContent);

            // Clear search if exists
            $('#search-term').val('');
            var searchTerm = '';

            // Update active states
            $('.filter__category').removeClass('active');
            $(this).addClass('active');
            
            // Close dropdown after selection
            $('#js-filter-wrapper').attr('data-open', 'false');

            // Update URL and make the AJAX call
            updateUrl(1, category, searchTerm);
            ajaxCall(postType, category, taxonomy, 1, false, exclude, searchTerm);
        });
    }

    // Pagination, filter and sorting event listners
    function eventListnerFilters() {
        var postType = $("#posts_wrapper").data("post_type");
        var taxonomy = $("#posts_wrapper").data("taxonomy");
        var exclude = $("#posts_wrapper").data("exclude");

        // Search form submit handler
        $('#filter-form').submit(function (event) {
            event.preventDefault();

            var searchTerm = $('#search-term').val();
            var currentUrlParams = new URLSearchParams(window.location.search);
            var urlSearchTerm = currentUrlParams.get('search-term');

            if (searchTerm == '') $('#filter-form').parent().attr('data-visible', false);

            var category = getCategories();
            $('#filter-form').parent().attr('data-visible', false);

            updateUrl(1, category, searchTerm);
            ajaxCall(postType, category, taxonomy, 1, false, exclude, searchTerm);
        });

        function pagination() {
            if ($(".page-numbers")) {
                $(document).on("click", ".page-numbers", function (e) { // We use document because the pagination is dynamically generated
                    e.preventDefault();

                    var page = $(this).attr("href");
                    var to_page = parseInt(page.substring(page.lastIndexOf("=") + 1));
                    var category = getCategories();
                    var searchTerm = $('#search-term').val();

                    updateUrl(to_page, category, searchTerm);
                    ajaxCall(postType, category, taxonomy, to_page, false, exclude, searchTerm);
                });
            }
        }

        function clearFilter() {
            $(document).on("click", '.clear-filters', function (e) {
                e.preventDefault();
                $('.filter__category').removeClass('active');
                $('#js-mobile-dropdown-wrapper').attr('data-open', 'false');
                $('#search-term').val('');
                var searchTerm = $('#search-term').val();

                $(this).addClass('active');
                updateUrl(1, '');
                ajaxCall(postType, 'all', taxonomy, 1);
            });
        }

        handleFilterToggle();
        categoryClick();
        pagination();
        clearFilter();
    }



    function init() {
        eventListnerFilters();
        // rangeSliderInit();
    }

    init();
});
