<?php

/**
 * Focal point image positioner
 * Version 1.0.0
 *
 * @package LabelVier
 * @author Nathanael & Eric
 *
 * @Usage
 * $focal_enabled = get_post_meta( $image_id, '_focal_check', true );
 * if ( $focal_enabled ) {
 *      $focal_x = get_post_meta( $image_id, '_focal_x', true );
 *      $focal_y = get_post_meta( $image_id, '_focal_y', true );
 * } else {
 *      $focal_x = 50;
 *      $focal_y = 50;
 * }
 * wp_get_attachment_image($image_id, 'full', false, [
 *      'style' => 'object-position: ' . $focal_x . '% ' . $focal_y . '%;']
 * )
 */

function attachment_fields_to_edit_focal_point($form_fields, $post)
{
    ob_start(); ?>
    <script>
        jQuery(window).ready(function() {

            // Target the default attachment thumbnail container
            const focalTargetImage = jQuery('.thumbnail.thumbnail-image img');

            if (focalTargetImage.length) {
                // Add focal Elements if non-existing
                if (!focalTargetImage.parent("#imageFocalWrapper<?= $post->ID ?>").length) {
                    focalTargetImage.wrap("<div id='imageFocalWrapper<?= $post->ID ?>'></div>");
                    focalTargetImage.after(
                        "<div id='imageFocalWrapper__focus<?= $post->ID ?>' class='imageFocalWrapper__focus'><div class='imageFocalWrapper__focus-line--left'></div><div class='imageFocalWrapper__focus-line--right'></div><div class='imageFocalWrapper__focus-line--top'></div><div class='imageFocalWrapper__focus-line--bottom'></div></div>");
                }
            } else {
                // Remove focal function on non-image attachments
                jQuery('.compat-field-focal_check').detach();
            }

            // ID the 'use focal' checkbox
            const focalCheck = jQuery("input#focal_check<?= $post->ID ?>");

            // ID the created focal elements
            const focalTargetImageWrapper = jQuery("#imageFocalWrapper<?= $post->ID ?>");
            const focalTargetImageFocus = jQuery("#imageFocalWrapper__focus<?= $post->ID ?>");
            const focalInputX = jQuery("#focal_x<?= $post->ID ?>");
            const focalInputY = jQuery("#focal_y<?= $post->ID ?>");

            // Get and set dimensions and sizes
            let focalPosX;
            let focalPosY;

            // Monitor clicks in image to determine selected focus
            focalTargetImageWrapper.click(function(event) {
                posToPercentages(event);
                if (focalPosX !== focalInputX.val() && focalPosY !== focalInputY.val() && focalCheck.is(':checked')) {
                    focalInputX.val(focalPosX);
                    focalInputY.val(focalPosY);
                    focalTargetImageFocus.css({
                        left: focalPosX + '%',
                        top: focalPosY + '%'
                    });
                    focalInputY.change();
                }
            });

            // Check current state of checkbox
            if (focalCheck.is(':checked')) {
                focalTargetImageWrapper.addClass('active');
                focalPosX = focalInputX.val();
                focalPosY = focalInputY.val();
                focalTargetImageFocus.css({
                    left: focalPosX + '%',
                    top: focalPosY + '%'
                });
            }

            // Monitor changes on checkbox
            focalCheck.change(function() {
                if (this.checked) {
                    focalTargetImageWrapper.addClass('active');
                    focalInputX.val(50);
                    focalInputY.val(50);
                } else {
                    focalTargetImageWrapper.removeClass('active');
                }
            });

            // Enable and monitor drag on focusTarget
            focalTargetImageFocus.draggable();
            focalTargetImageFocus.on('dragstop', function(event, ui) {
                posToPercentages(event);
                if (focalPosX !== focalInputX.val() && focalPosY !== focalInputY.val()) {
                    focalInputX.val(focalPosX);
                    focalInputY.val(focalPosY).change();
                    focalTargetImageFocus.css({
                        left: focalPosX + '%',
                        top: focalPosY + '%'
                    });
                }
            });

            // Calculate position to percentages and round up
            function posToPercentages(event) {
                const focalImgW = focalTargetImageWrapper.outerWidth();
                const focalImgH = focalTargetImageWrapper.outerHeight();
                const focalImgPercentX = 100 / focalImgW;
                const focalImgPercentY = 100 / focalImgH;
                focalPosX = ((event.pageX - focalTargetImageWrapper.offset().left) * focalImgPercentX).toFixed(0);
                focalPosY = ((event.pageY - focalTargetImageWrapper.offset().top) * focalImgPercentY).toFixed(0);
                if (focalPosX >= 100) {
                    focalPosX = 100;
                }
                if (focalPosY >= 100) {
                    focalPosY = 100;
                }
                if (focalPosX <= 0) {
                    focalPosX = 0;
                }
                if (focalPosY <= 0) {
                    focalPosY = 0;
                }
                console.log('x = ' + focalPosX);
                console.log('y = ' + focalPosY);
            }
        });
    </script>
    <style>
        /*.compat-field-focal_check,*/
        /*.compat-field-focal_check th,*/
        /*.compat-field-focal_check td {*/
        /*    height: 30px;*/
        /*    display: inline-flex;*/
        /*    align-items: center;*/
        /*}*/
        /*.compat-field-focal_check input {*/
        /*    margin: 0 0 0 7px !important;*/
        /*}*/

        .thumbnail.thumbnail-image img {
            margin-bottom: 0 !important;
        }

        .thumbnail.thumbnail-image .attachment-actions {
            margin-top: 17px;
        }

        #imageFocalWrapper<?= $post->ID ?> {
            position: relative;
            display: inline-block;
            z-index: 10;
            overflow: hidden;
        }

        #imageFocalWrapper<?= $post->ID ?>.active #imageFocalWrapper__focus<?= $post->ID ?> {
            display: block;
        }

        .imageFocalWrapper__focus {
            display: none;
            position: absolute;
            left: 50%;
            top: 50%;
            width: 30px;
            height: 30px;
        }

        .imageFocalWrapper__focus:before {
            display: block;
            position: relative;
            left: -15px;
            top: -15px;
            content: "";
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: url("<?= get_template_directory_uri() ?>/src/assets/img/dev-favicon.png") 0 0 no-repeat;
            opacity: 0.5;
            background-size: 100%;
            background-color: rgba(255, 255, 255, 0.6);
        }

        .imageFocalWrapper__focus div {
            position: absolute;
            content: "";
            background: #00000055;
            opacity: 0.7;
            box-shadow: 0 0 1px 0 #ffffff;
        }

        .imageFocalWrapper__focus-line--left,
        .imageFocalWrapper__focus-line--right {
            height: 4px;
            width: 200vw;
            top: -2px;
        }

        .imageFocalWrapper__focus-line--left {
            right: 45px;
        }

        .imageFocalWrapper__focus-line--right {
            left: 15px;
        }

        .imageFocalWrapper__focus-line--top,
        .imageFocalWrapper__focus-line--bottom {
            width: 4px;
            height: 200vw;
            left: -2px;
        }

        .imageFocalWrapper__focus-line--top {
            bottom: 45px;
        }

        .imageFocalWrapper__focus-line--bottom {
            top: 15px;
        }
    </style>
<?php
    $focalCheck = (bool) get_post_meta($post->ID, '_focal_check', true);
    $focalX     = (float) get_post_meta($post->ID, '_focal_x', true);
    $focalY     = (float) get_post_meta($post->ID, '_focal_y', true);

    $contents = ob_get_clean();

    $checked                    = ($focalCheck) ? 'checked' : '';
    $form_fields['focal_check'] = array(
        'label' => 'Set focal point',
        'input' => 'html',
        'html'  => "<input type='checkbox' {$checked} name='attachments[{$post->ID}][focal_check]' id='focal_check{$post->ID}' />{$contents}",
        'value' => $focalCheck,
        'helps' => 'Bepaal wat het focuspunt van de afbeelding moet zijn, wanneer de afbeelding groter is dan zijn container. Let op dat de geselecteerde focus toegepast wordt op alle plekken waar deze afbeelding gebruikt wordt.'
    );

    $form_fields['focal_x'] = array(
        'input' => 'html',
        'html'  => "<input type='hidden' name='attachments[{$post->ID}][focal_x]' value='{$focalX}' id='focal_x{$post->ID}' />",
        'value' => $focalX,
    );

    $form_fields['focal_y'] = array(
        'input' => 'html',
        'html'  => "<input type='hidden' name='attachments[{$post->ID}][focal_y]' value='{$focalY}' id='focal_y{$post->ID}' />",
        'value' => $focalY,
    );

    return $form_fields;
}

if (!is_customize_preview()) {
    add_filter('attachment_fields_to_edit', 'attachment_fields_to_edit_focal_point', null, 2);
}

function attachment_fields_to_save_focal_point($post, $attachment)
{
    $focalCheck = ($attachment['focal_check'] === 'on') ? '1' : '0';
    update_post_meta($post['ID'], '_focal_check', $focalCheck);

    $focalX = $attachment['focal_x'];
    update_post_meta($post['ID'], '_focal_x', $focalX);

    $focalY = $attachment['focal_y'];
    update_post_meta($post['ID'], '_focal_y', $focalY);

    return $post;
}
if (!is_customize_preview()) {
    add_filter('attachment_fields_to_save', 'attachment_fields_to_save_focal_point', null, 2);
}

/**
 * Get an attachment image html (incl focal point css).
 *
 * @param $attachment_id
 * @param string $size
 * @param bool $icon
 * @param string $attr
 *
 * @return string
 */
function wp_get_attachment_image_with_focal_point($attachment_id, $size = 'thumbnail', $icon = false, $attr = [])
{
    $focal_enabled = get_post_meta($attachment_id, '_focal_check', true);
    if ($focal_enabled) {
        $focal_x = get_post_meta($attachment_id, '_focal_x', true);
        $focal_y = get_post_meta($attachment_id, '_focal_y', true);
        $focal_style = '-o-object-fit: cover;object-fit: cover;object-position: ' . $focal_x . '% ' . $focal_y . '%;';
        $attr['style'] = isset($attr['style']) ? $attr['style'] . ';' . $focal_style : $focal_style;
        $class_name = 'has-focus-point post-image';
        $attr['class'] = isset($attr['class']) ? $attr['class'] . $class_name : $class_name;
    }
    return wp_get_attachment_image($attachment_id, $size, $icon, $attr);
}


/**
 * Get image even faster because the function name is shorter lol
 */
function wp_get_img($attachment_id, $size = 'large', $icon = false, $attr = [])
{
    return wp_get_attachment_image_with_focal_point($attachment_id, $size, $icon, $attr);
}
