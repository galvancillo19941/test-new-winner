<script setup lang="ts">
/**
 * The custom error page, prerendered to error.html: S3 serves it for any path
 * that doesn't exist. Static (no JavaScript), so its styles live in
 * content/theme.css (the client bundle never imports this component).
 */
import { useSite } from "../site/site.ts";

const page = useSite().errorPage;
</script>

<template>
  <main>
    <h1>{{ page.title }}</h1>
    <p>{{ page.message }}</p>
    <a href="/">{{ page.linkLabel }}</a>
  </main>
</template>
