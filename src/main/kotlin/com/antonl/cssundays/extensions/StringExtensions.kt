package com.antonl.cssundays.extensions

import java.text.Normalizer

fun String.toSlug(): String = Normalizer
    .normalize(this, Normalizer.Form.NFD)
    .replace("[^\\w\\s-]".toRegex(), "") // Remove all non-word, non-space or non-dash characters
    .replace('-', ' ') // Replace dashes with spaces
    .trim() // Trim leading/trailing whitespace (including what used to be leading/trailing dashes)
    .replace("\\s+".toRegex(), "-") // Replace whitespace (including newlines and repetitions) with single dashes
    .lowercase() // Lowercase the final results