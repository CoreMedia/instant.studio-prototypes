Introduce a "tree" concept into the way my content items are organized.

Look in the provided screenshot to get the desired folder structure.

Adjust the content in chooser_data.json as follows: 
Each content item should reside in one of the folders. Use good judgement to pick a good folder for each content item

The selection modal should behave as follows:
* We start at the root folder (Chef Corp.)
* The breadcrumb above the selection reflects the currently selected folder
* The grid shows 
  * First, all subfolders of the currently selected folder
  * Then, all content items that are in that folder, sorted by type, then name.
* I can double click on a folder. This takes me to that folder, and the grid updates accordingly
* Behavior when double-clicking on a non-folder stays the same as currently implemented: This adds the double-clicked content item to the list, then closes the modal
* I can also click on an element of the breadcrump. When I do, this takes me to the respective folder, and the grid updates accordingly.