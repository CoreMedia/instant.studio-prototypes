Now let's focus on the modal chooser window. Look at the screenshot provided for visual hints.

I'll explain the structure of the modal to you, top to bottom:

* First row has static title "Content Item Chooser". On the right, the cross is a button that will close the window when clicked.
* Second row is a tool bar with the following items:
  * "Back" button (no function for now)
  * "Forward" button (no function for now)
  * A chooser buttongroup that let's you select between "repository" view and "search" view. hardcoded to "repository view" for now.
  * A dropdown that filters for content item types (see below for explanation). Has the options "All" (no filtering), or picking exactly one of the availble content item types.
  * A "search" textfield. No function for now
  * A view chooser that lets you pick between "list" view and "thumbnail" view. No function for now, hardcoded to use list view
* Next row is a container with the following elemens:
  * A "Breadcrumb" showing the currently selected folder, which in this case is "Chef Corp. / Editorial / Downloads"
  * A grid showing the contents of the currently selected folder. Take the instructions below on what to show there into account. The visual structure is like this:
    * First column is the content item type. This can be one of: Folder, Article, Picture, Teaser, Video
    * Second column is the name of the content item
    * Third column is the creation date of the content item
    * Fourth column is the state of the content item, shown as an icon. Can be one of: Checked In, Checked Out, Approved, Published, Deleted. Find good icons for the visualization state.
  * I can select one or more of the rows shown. Selection status must be visualized appropriately.
  
* Final row is a status bar, with buttons on the right side
  * On the left, there's a counter showing the number of available rows
  * On the right, there's three buttons:
    * "Cancel" just closes the modal with no action
    * "Add" adds the selected rows to the "Pictures and Related Media" field in the main document form and keeps the modal open
    * "Add & Close" adds the selected rows to the "Pictures and Related Media" field in the main document form, and closes the modal.
  
For the rows shown in the grid, please do the following:

Create s separate file (yaml or json) that contains dummy data on what to show there.
Each entry in that file should represent one content item. It needs these fields as a "sub-structure": Type, Name, creation date, and state.
The modal should load the data from this file on open.