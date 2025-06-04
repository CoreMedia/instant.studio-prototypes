Introduce a second variant for the chooser modal, as follows:

* The current mode is "modal"
* We want an additional "non-modal" mode. 
* We want a button in the header toolbar that opens the window in non-modal mode
* When opened in non-modal mode, the following differences to behavior apply:
  * A double-click on a content item opens the selected content item in a new tab
  * We can drag-and-drop items from the list to the linklist in the chooser form
  * we don't want a shim (i.e., the dialog is not modal)
* Everything else stays the same