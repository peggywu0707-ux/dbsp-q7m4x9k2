# DU–BOO Study Planner

Interactive static study-planning page for a prospective urodynamics-linked female voiding-dysfunction biobank.

## What it does

- Shows the full urine/vaginal specimen workflow as an interactive mind map.
- Records collection, processing, storage, cryobox assignment, purpose, and estimated cost for every aliquot/assay.
- Lets the user defer any item to a later phase; deferred nodes turn gray and are removed from the active budget.
- Recalculates exact two-sample t-test power with the noncentral t distribution.
- Recalculates total budget, reserve, cryoboxes, and freezer baskets.
- Exports the selected budget to CSV and prints the active plan to PDF.
- Stores local choices in the browser only (`localStorage`); no patient data are collected or transmitted.

## Deployment

This is a dependency-free static site except for the vendored `jStat` browser bundle. Publish the repository root with GitHub Pages (Deploy from branch: `main` / root).

## Important

All prices are editable planning placeholders. Replace them with written quotations from the selected core facility/vendor before grant submission. The tool does not replace an IRB-approved laboratory SOP or a formal biostatistics consultation.

## License note

`vendor/jstat.min.js` is jStat 1.9.6 and is redistributed under its MIT license; see `vendor/JSTAT_LICENSE.txt`.
