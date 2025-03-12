<?php

// Als je een nieuwe vacature (vacature) aanmaakt, krijg je meteen dit template te zien.
function tref_vacature_register_template($args, $post_type)
{
    if ('vacature' === $post_type) {
        $args['template'] = array(
            array('acf/hero-small', array(
                'data' => array(
                    'alt_title' => 'Vacature',
                    'payoff' => 'Vacature naam invullen'
                )
            )),
            array('acf/media-row'),
            array('acf/text-single', array(
                'data' => array(
                    'text' => '<p class="intro">Korte intro tekst invullen. Deze tekst is groter en dik gedrukt.</p> En je kan verder het aanvullen met langere tekst.',
                    'button' => array(
                        'title' => 'Neem contact op',
                        'url' => 'http://treffend-1.local/contact/',
                        'target' => ''
                    )
                )
            )),
            array('acf/media-row', array(
                'data' => array(
                    'margin_top_large' => '1',
                    'margin_bottom_large' => '1',
                ),
                'className' => 'is-style-special_one'
            ))
        );
    }

    return $args;
}
add_filter('register_post_type_args', 'tref_vacature_register_template', 10, 2);



// Als je een nieuw project (post) aanmaakt, krijg je meteen dit template te zien.
function tref_post_register_template($args, $post_type)
{
    if ('post' === $post_type) {
        $args['template'] = array(
            array('acf/hero-small', array(
                'data' => array(
                    'alt_title' => 'Klantnaam',
                    'payoff' => 'Lorem ipsum dolor sit amet,<br>consectetur adipiscing elit.'
                )
            )),
            array('acf/media-row'),
            array('acf/text', array(
                'data' => array(
                    'margin_bottom_large' => '1',
                )
            )),
            array('acf/quote', array(
                'data' => array(
                    'quotes' => array(
                        array(
                            'name' => 'name',
                            'function' => '',
                            'quote' => '',
                            'afbeelding' => ''
                        )
                    )
                )
            )),
            array(
                'acf/posts',
                array(
                    'data' => array(
                        'show_button' => true,
                        'title' => 'Meer werk'
                    )
                )
            )
        );
    }

    return $args;
}
add_filter('register_post_type_args', 'tref_post_register_template', 10, 2);
