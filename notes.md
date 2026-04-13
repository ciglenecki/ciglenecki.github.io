analyze codebase

simplify css where possible, ask further questions, very specific and precies change questions

'item' keyword should be replaced with 'entry'

bookmark-item -> bookmark-entry

ahref should be only used for links, now, the bookmark and icon is incldued in <a> in bookmarks

.bookmark-description,
.project-description,
.video-description should all be removed, they dont to anything.

there should be a "date-prefix" class whose

post-info should be post-entry

project-info -> project-entry


when i scroll towards the bottom, profile seciton moves a bit, it should always be on the same level and not moving at all


===

remove all partials that are not truely reusable across multiple sites or called in for loops and move the code to 

remove profile links


layouts/index.html and layouts/_default/list.html are almost identical

ask me questions


====
  
when i scroll, my sticky profile moves, i think it should always be fixed even if i scroll (this has something to do with margin?)
=====


These are my projects. Gather basic information from the top of the readme for each, and come up with a two-three sentence description using the phrasing and words i already used in those readme files.

https://github.com/ciglenecki/nerf-research

https://github.com/ciglenecki/eeg-driver-fatigue-detection

https://github.com/ciglenecki/ml-competition-audio-instruments

https://github.com/ciglenecki/ml-competition-cv-geoguessr

https://github.com/ciglenecki/torch-jpeg-blockiness


https://github.com/ciglenecki/stylegan2-latent-projection-inversion

https://github.com/ciglenecki/holt-linear

put placeholder images as well 

you should create "projects" section in the navbar, that shows these projects, you should try to reuse components in style from home/bookmarks. but make sure the image is a square (200x200px) or something like this. the image should be fitted to that dimension and cropped where needed so it's not stretched.
