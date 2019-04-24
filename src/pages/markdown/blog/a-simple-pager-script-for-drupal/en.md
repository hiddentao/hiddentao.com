---
title: A simple pager script for Drupal
date: '2010-08-24'
summary: "Today I found myself needing to render pager links in [Drupal 6](http:&#47;&#47;drupal.org&#47;) for a list of items. By _pager_ I mean the links you usually see at the bottom of the page which indicate what page you're currently on, what pages comes before and after and where you are in the grand context of the total number of pages available (example: [http:&#47;&#47;drupal.org&#47;search&#47;apachesolr_search&#47;e](http:&#47;&#47;drupal.org&#47;search&#47;apachesolr_search&#47;e)). \r\n"
tags:
  - Drupal
  - PHP
  - Pager
---
Today I found myself needing to render pager links in [Drupal 6](http://drupal.org/) for a list of items. By _pager_ I mean the links you usually see at the bottom of the page which indicate what page you're currently on, what pages comes before and after and where you are in the grand context of the total number of pages available (example: [http://drupal.org/search/apachesolr_search/e](http://drupal.org/search/apachesolr_search/e)).

Drupal has built-in pager generation methods ([theme_pager](http://api.drupal.org/api/function/theme_pager/6)) but these either require you to have loaded the data to be paged from the local Drupal database or require you to shoe-horn the data you wish to page into Drupal's pager global variables. I needed something simpler which would work with any data but which would still generate output similar to what Drupal's pager functions generate.

After a bit of work I had something which did the job:

```php
function pager_render_links(total_pages, current_page, num_page_links)
{
if (1 > total_pages)
return;

var buttons = new Object;
buttons["first"] = new Object; buttons["first"]["text"] = "« first"; buttons["first"]["link_tooltip"] = "Go to first page";
buttons["last"] = new Object; buttons["last"]["text"] = "last »"; buttons["last"]["link_tooltip"] = "Go to last page";
buttons["next"] = new Object; buttons["next"]["text"] = "next »"; buttons["next"]["link_tooltip"] = "Go to next page";
buttons["prev"] = new Object; buttons["prev"]["text"] = "« previous"; buttons["prev"]["link_tooltip"] = "Go to previous page";
buttons["current"] = new Object; buttons["current"]["class"] = "current";

var pager_first = current_page - Math.floor(num_page_links / 2);
var pager_last = current_page Math.floor(num_page_links / 2);

// normalize
if (1 > pager_first)
{
pager_last = (1 - pager_first);
pager_first = 1;
}
if (total_pages < pager_last) {
pager_first -= (pager_last - total_pages);
if (1 > pager_first)
pager_first = 1;
pager_last = total_pages;
}

var items = '

// show 'prev' button
if (1 < current_page) {
// show 'first' button
if (1 < pager_first) {
items = pager_construct_page_link("pager-first", total_pages, 1, num_page_links, buttons["first"]);
}
items = pager_construct_page_link("pager-previous", total_pages, current_page-1, num_page_links, buttons["prev"]);
// show ellipsis
if (1 < pager_first) {
items = pager_construct_text('...', 'pager-ellipsis');
}
}

// page links
for (var i=pager_first; i<=pager_last; i) {
if (i == current_page) {
items = pager_construct_text('**' current_page '**', 'pager-current');
} else {
var bt = new Object; bt["text"] = "" i; bt["link_tooltip"] = "Goto page " i;
items = pager_construct_page_link("pager-item", total_pages, i, num_page_links, bt);
}
}

// show 'next' button
if (total_pages > current_page) {
// show ellipsis
if (total_pages > pager_last) {
items = pager_construct_text('...', 'pager-ellipsis');
}
items = pager_construct_page_link("pager-next", total_pages, current_page 1, num_page_links, buttons["next"]);
// show 'last' button
if (total_pages > pager_last) {
items = pager_construct_page_link("pager-last", total_pages, total_pages, num_page_links, buttons["last"]);
}
}

items = "

";

document.getElementById("pager").innerHTML = items;
}

function pager_construct_page_link(li_class, total_pages, current_page, num_page_links, button)
{
var text = current_page;
if (undefined != button["text"])
text = button["text"];

var tooltip = '';
if (undefined != button["link_tooltip"])
tooltip = button["link_tooltip"];

return '

*   ['onclick="pager_render_links(' total_pages ',' current_page ',' num_page_links '); return false;"'
    ' title="' tooltip '">' text '](#)';
}
function pager_construct_text(text, li_class)
{
return '*   ' text '';
}
```

The only hook you need to know is **simple-pager-links**. You pass it to the total number of pages in your result set, the current page number (should be between `1` and the total number of pages), and the number of page links to show either side of the current page's item when rendering the pager links. Note that the pager does not need to know about how many data items you wish to show on each page or even what data you plan to show. The generated page links are of the form `http://domain.com/path?page=page_number`.

Example usage:

```php
// total no. of pages = 20

// current page = 5

// no. of page links to show = 5

// base_url = http://domain.com/directory

$pager_html = theme('simple-pager-links', 20, 5, 5, 'http://domain.com/directory');
```

