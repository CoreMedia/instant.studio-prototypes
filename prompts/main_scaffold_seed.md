Your job is to create a simple frontend as a clickable prototype. It must be based on React, and I want to able to run it locally and see changes to the react code "live" as I make them.

Start by looking at studio_form.png. This is a screenshot of how I want the main HTML page to look. Create this as HTML, but with all static "placeholder" content for now. Pay close attention to the colors, fonts, and distribution of the elements, and reproduce them as exactly as possible in the to-be-generated HTML.

Here's a description of studio_form:

* First grey row is the Header Toolbar. From left to right:
  * A "Hamburger" button
  * A fixed "Content" label
  * A few other buttons. All of those should just be placeholders for now and don't do anything
* The next row (in blue) is a tabbed panel, with currently only one tab open. This is the active tab, showing content named "Enjoy your passion"
* The next row is a container that is divided vertically. On the tab there is a toolbar with some buttons. They all have no function currently.
  * The left section is the document form. It contains some collapsible forms:
    * "Details": 
      * Contains "Article Title" (a String). Just use some dummy content
      * Contains "Article Text" (Richt text). Just use some dummy content
    * "Teaser":
      * Currently collapsed
    * "Pictures and Other Media":
      * Contains links to other documents, visualized by a thumbnail, and the name of the linked content item
      * When I click on the line that visualized the linked other content item, a free-floating window should open in the middle of the view port. Leave it empty for now and just show a placeholder text "Content item chooser"
  * The right section is a preview. It shows:
    * The "Article Title" on top, in bold
    * The linked image (just use a crossed-through placeholder sqare)
    * The "Article Text"