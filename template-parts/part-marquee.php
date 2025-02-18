<?php
$marquee_text = get_field('marquee_items', 'option'); 

// Dutch month names
$dutch_months = [
    1 => 'januari', 2 => 'februari', 3 => 'maart', 4 => 'april',
    5 => 'mei', 6 => 'juni', 7 => 'juli', 8 => 'augustus',
    9 => 'september', 10 => 'oktober', 11 => 'november', 12 => 'december'
];

// Dutch day names
$dutch_days = [
    'Monday' => 'Maandag', 'Tuesday' => 'Dinsdag', 'Wednesday' => 'Woensdag',
    'Thursday' => 'Donderdag', 'Friday' => 'Vrijdag', 'Saturday' => 'Zaterdag',
    'Sunday' => 'Zondag'
];

$current_date = $dutch_days[date('l')] . ' ' . date('j') . ' ' . $dutch_months[date('n')];

if ($marquee_text): ?>
    <section class="marquee">
        <p><?= $current_date ?></p>
        <?php foreach ($marquee_text as $text): ?>
            <p><?= esc_html($text['text']) ?></p>
        <?php endforeach; ?>
    </section>
<?php endif; ?>