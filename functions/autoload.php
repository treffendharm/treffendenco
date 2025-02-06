<?php 

// This is an autoload.php for require_once all the files in the functions folder
// Path: functions/autoload.php

$files = glob(__DIR__ . '/*.php');

foreach ($files as $file) {
    if ($file !== __FILE__) {
        require_once $file;
    }
}