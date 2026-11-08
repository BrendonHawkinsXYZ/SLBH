# Metabooks website experience audit

Observed November 2, 2026. Reference: [metabooks.art](https://metabooks.art/).

Metabooks presents an artists’ book archive through a very spare visual system: white space, pale gray image fields, small monospaced catalogue text, and occasional large bold sans serif type. The strongest organizing device is the grid. A book, its identification, the surrounding empty space, and the next book all have a consistent place within it. The interface gives the objects most of the visual attention.

For Studio Lab BH, the consequential reference is the entire sequence: an introductory pause, a small persistent navigation bar, a changing selection of work, a searchable archive, an enlarged object view, and an understated footer. Matching only the white background and typefaces would leave much of this experience behind.

This audit records the live interface and the results of clicking, scrolling, searching, expanding descriptions, advancing media, and following navigation. Desktop observations use a 1440 × 1000 CSS pixel viewport; intermediate observations use 800 × 1000; mobile observations use 390 × 844. Mobile refers to the narrow browser layout tested here, rather than a physical phone. Measurements are snapshots at those sizes, not a claim about every breakpoint. The site’s displayed counts and release information can change.

## Overall character

The site feels closer to a research collection, printed index, or small art institution than a conventional portfolio. Its authority comes from the specificity of the objects and their records. There is little promotional language in the interface. The images show the books as material objects, often retaining discolored paper, wear, irregular edges, binding, and differences in proportion.

Large stretches of empty space are part of the composition. The left half of a desktop page may remain empty while all the reading happens on the right. Section labels sometimes sit at the bottom of a tall, nearly empty block. The footer repeats this pattern. These pauses give the small text and carefully contained images a deliberate rhythm.

The interface stays almost entirely achromatic. Cream paper, red typography, blue covers, photographs, and other colors belong to the exhibited material. The surrounding UI remains white, black, and gray. There is no visible grain treatment on the page surface.

Typography establishes two distinct voices. Large bold sans serif text introduces the institution or opens the mobile menu. Nearly everything needed to navigate and identify material uses compact monospaced type. The catalogue often gives titles, artists, dates, actions, counts, and explanatory prose the same small size; placement, capitalization, and spacing carry the hierarchy.

## Homepage arrival

Source: [Homepage](https://metabooks.art/). Screenshots: [desktop opening](references/metabooks/01-home-opening-desktop.jpg), [mobile opening](references/metabooks/21-home-opening-mobile.jpg).

### Desktop introduction

The first visible screen is an expansive white field with a bold, left aligned introductory text block around the vertical center. There are no visible book images or navigation controls in that first view. The name begins on its own line, followed immediately by a statement describing the archive and its research, publishing, and curatorial purpose.

At 1440 × 1000, the block starts about 10 px from the left edge and around y = 424. It extends across most of the available width. The introduction uses the site’s bold Unica face at 38 px with a 38 px line height and approximately −1.3 px letter spacing. The tightly set lines make the statement read as one substantial typographic mass.

The top and bottom whitespace are much larger than the text block. This is a screen to enter through, with the mission occupying the place that a photographic hero would usually take.

The opening held its position during the scroll and Page Down attempts in this session. Clicking the text area initiated the transition. The introductory field moved upward, and the navigation and catalogue arrived beneath it. There was an intermediate moment when the departing statement and arriving book display were both visible. Once the transition finished, ordinary page scrolling worked.

Following the site name back to the homepage later replayed the introduction. This was not confined to the first arrival in this browsing session.

### Mobile introduction

At 390 px wide, the opening is much simpler: the bold site name alone sits near the vertical center, about 10 px from the left. The long mission statement is hidden. The visible bold text is approximately 30 px with a 32 px line height and slightly tight tracking.

A tap in the opening area reveals the mobile homepage. The absence of an explicit enter button or visible scroll cue is a real characteristic of the arrival experience. A literal adoption would carry that discovery requirement with it.

## Homepage after entry

Screenshots: [desktop catalogue](references/metabooks/02-home-catalogue-desktop.jpg), [exhibition section](references/metabooks/03-home-exhibitions-footer-desktop.jpg), [mobile catalogue](references/metabooks/22-home-catalogue-mobile.jpg).

### Desktop sequence

The revealed homepage follows this order:

1. A narrow navigation row at the top.
2. One featured book in a broad pale gray field.
3. A right aligned metadata block and an archive count and link.
4. A row of four smaller book images, each with a compact identification underneath.
5. A section marker introducing the exhibitions.
6. Two exhibition previews in equal halves.
7. The shared footer.

The featured image field stretches almost the full viewport width, keeping approximately 10 px outer margins. At the tested desktop size, it is about 400 px tall. The book sits centered within it at a much smaller scale than the field, retaining its complete outline. The surrounding gray is part of the visual framing, with substantial room around the object.

Below the feature, the metadata begins just to the right of the page midpoint. The opposite half remains empty. A fine gray vertical rule precedes the text. The book’s title, artist, and date form a short stack. A second, taller ruled block below carries the count and route into the archive near its bottom edge.

The four smaller books share equal square image fields, with narrow white gutters. The fields align precisely; the books inside them can have different silhouettes. The text sits outside the gray fields on white, beside a one pixel left rule. This makes the image display and catalogue identification two adjacent parts of one record.

The first observed feature was Bruce Nauman’s Burning Small Fires. A later homepage visit featured Edward Ruscha’s Twentysix Gasoline Stations and a different set of smaller books. The main collection order also changed between visits. The selection varies in practice; the exact selection algorithm was not established.

The exhibition marker is offset to the right half and anchored near the bottom of a tall ruled space. Two larger preview fields follow. Each carries a title, venue or presentation format, and year below its image. Both homepage previews led to the shared exhibitions page, rather than separate exhibition detail routes.

### Mobile sequence

The featured book becomes a square display spanning the 370 px usable width between the 10 px page margins. Its title, artist, and year move below it across the full width. The archive link follows in a second ruled block.

The four smaller book images form a two by two arrangement of approximately 180 px square fields with 10 px gutters. Their desktop captions disappear in this layout. They remain links, but visual recognition of the cover becomes the primary cue.

This is a meaningful difference from the mobile archive, which shows one large, captioned record at a time. The homepage favors a compact visual sample; the archive favors individual inspection.

## Shared navigation

### Desktop header

The desktop header is roughly 34 px tall. It has a white opaque surface and stays at the top as the document scrolls. It does not become a large floating panel or change into a different navigation treatment at the footer.

The site name and four principal destinations sit in one compact cluster at the left. The global search field begins near the middle of a wide desktop view. The cart count and link sit at the far right. Everything fits into the same small monospaced typographic register.

The current main destination is muted gray. Other destinations remain black. The homepage name is gray when the homepage is active. There are no enclosing tabs, pill backgrounds, or large active indicators.

The global search is an unboxed text input. Its empty state is a light gray word within the row. Clicking and typing replaces that word with the query. Pressing Enter navigates to a dedicated search results route.

### Mobile header and menu

Screenshot: [open mobile menu](references/metabooks/23-mobile-menu.jpg).

On mobile, the header retains the site name at the left, a menu toggle immediately beside it, and the cart at the right. The full row of destinations and global search field disappear.

The menu toggle opens a white panel that covers the content. It changes to a close action in the header. The four destinations appear as a tightly stacked, mixed case list in large bold sans serif type. At 390 × 844, the list sits around the middle of the screen, beginning about x = 10 and y = 360. The type is approximately 30 px with 32 px line spacing.

The menu uses text alone. It has no hamburger icon, search box, thumbnails, explanatory copy, or additional promotional links. The cart remains available in the header while the menu is open. Selecting a destination replaces the page and restores the closed header.

The panel visibly moves into place rather than appearing as an instantaneous static rectangle. Early animation frames can show a mostly empty white panel before the large navigation list reaches its final position.

## Collection overview

Source: [Collection](https://metabooks.art/collections/collection). Screenshots: [desktop overview](references/metabooks/05-collection-grid-desktop.jpg), [complete desktop page](references/metabooks/35-collection-full-desktop.jpg), [intermediate layout](references/metabooks/32-collection-medium.jpg), [mobile overview](references/metabooks/24-collection-mobile.jpg).

### Desktop search and taxonomy

The collection begins with an index above the images. At 1440 px wide it has four equal columns: artist lookup, decades, themes, and title lookup. The columns share the underlying image grid. The page keeps substantial space between the navigation and the first index labels, and between the short index columns and the start of the images.

The artist and title columns are initially sparse. Each has a small category label and a bare text input with a pale placeholder. Results appear beneath the input as text links. There is no enclosing search card, magnifying glass, or prominent submit button.

The decade column lists nine periods from the 1940s through the 2020s. Each desktop entry has a parenthesized count. The themes column contains 23 subject links, ranging from publishing forms and artistic movements to media and subject matter. It is the densest of the four columns and establishes most of the index’s height.

Counts add an inventory quality to the navigation. They indicate the scale of a grouping before it is opened. Their treatment is deliberately restrained: the same small mono type, with parentheses and leading zeros where used.

The index leads into a narrow collection heading row. The collection count appears at the left; a short archive description and an About link occupy the right half. The displayed overall collection count during the audit was 546.

### Grid and records

The main desktop archive uses four columns. At 1440 px wide, the measured fields are 347.5 px square, with 10 px gutters and 10 px outer margins. The pale gray is RGB 246, 246, 246, or `#f6f6f6`.

Books are centered within these fields and kept within a consistent viewing envelope. Portrait books are taller, landscape objects are wider, and square objects occupy more of both dimensions. Objects retain their proportions. The covers have enough empty space around them that none reads like an edge to edge background crop.

Beneath each image, the record has three compact lines: title, creator, and date. A gray rule sits to the left, with about 10 px between it and the text. The measured rule is 1 px in `#9d9d9d`. The text background remains white and the corners remain square.

Long title and creator lines are shortened with visible ellipses. Dates retain the specificity of the record, including ranges or uncertain dates where appropriate. There are no prices or purchase buttons on these archive cards.

The primary clickable surface is the book’s image field. Following it opens the object record. The repeated alignment makes browsing feel systematic even when the covers themselves are visually very different.

The sampled archive pages displayed 28 visible records each. The overall collection offered 19 numbered pages; the 106 item decade grouping offered four. This is explicit pagination rather than an endless feed.

### Intermediate width

At 800 px wide, the full desktop navigation is still present, but the archive grid becomes two columns. The sampled image fields are about 385 px square. The index also becomes two columns: artist and book lookup on the left, decades and themes on the right. The themes list sits below the decades.

This produces a much taller index than the 1440 px version. The first images began around y = 682 in the sampled decade page. It is a separate intermediate arrangement, with neither the four column desktop density nor the mobile search panel.

### Mobile collection

At 390 px, the main archive has one column of 370 px square image fields. Each full card, including identification and spacing, is about 427 px tall. This gives a cover much more screen space than it receives in the desktop grid. The title, creator, and year stay visible below it.

The index is removed from the normal flow. The collection count sits below the sticky header, followed by the first book. A thin fixed white row at the bottom offers entry to the archive search panel. It includes its own parenthesized count and a text action.

The bottom search row displayed 547 while the collection heading displayed 546. These are the observed interface values, not interchangeable totals.

## Finding and grouping books

### Artist lookup

Screenshots: [artist input](references/metabooks/06-collection-artist-search-desktop.jpg), [artist grouping](references/metabooks/07-artist-collection-desktop.jpg).

Typing the surname Ruscha into the artist field produced an Edward Ruscha link directly below it. The main book grid did not immediately become a filtered grid. The lookup first offers a destination to choose.

Following the suggestion opened an artist collection URL. The artist name and a count of 21 replaced the general collection heading. The same index remained above the images, and a route back to the overall collection occupied the opposite half of the heading row. The search field itself reset to its empty state.

The result can include material connected to the artist, rather than only records whose primary creator is that person. In the sampled artist grouping, a Jonathan Monk publication appeared among Ruscha’s own books.

### Title lookup

Typing gasoline into the book field produced a direct link to the matching Ruscha title underneath the input. The suggestion appeared after a short response interval. Following it opened the book page rather than a new title category.

This gives the two collection inputs different outcomes: the artist lookup leads to a group; the title lookup can lead straight to one object. Both remain visually part of the printed index.

### Decade and theme links

Sources: [1960s collection](https://metabooks.art/collections/1960-s), [Architecture collection](https://metabooks.art/collections/architecture). Screenshot: [theme collection](references/metabooks/34-theme-collection-desktop.jpg).

Selecting the 1960s opened a new collection route with a count of 106. Selecting Architecture opened another route with six results. Each retained the shared navigation, index, card treatment, and footer.

The active taxonomy link becomes light gray. The grouping’s name and count appear above its images. These controls act as navigation to individual group pages. The tested interface did not show a row of accumulated filter chips or a multi-select combination of artist, period, and theme.

### Pagination

Screenshot: [desktop pagination](references/metabooks/33-pagination-desktop.jpg).

Page numbers appear after the last row of books. They occupy a ruled area in the right half of the desktop layout, with considerable space above the small numeral links. The current page is muted and the other pages remain clickable text. Long ranges use an ellipsis.

Following page 3 of the decade collection changed the `page` query parameter, replaced the books, and returned the viewport to the top. The index therefore appears again before the next set of images. Pagination is a distinct page transition, rather than appending another row beneath the current position.

### Mobile search panel

Screenshot: [open mobile collection search](references/metabooks/25-mobile-collection-search.jpg).

Tapping the bottom search action moves a white panel in from the right. At rest it fills the viewport and covers the ordinary header and book content. Its first label begins around 10 px from the top and left.

Its vertical order is artist lookup, decades, book lookup, then themes. Groups are separated by generous blank spaces. The decade and theme links omit the individual desktop counts. Inputs are still bare text, and the bottom fixed action changes to close.

At the tested mobile height, the dense theme list extends close to the bottom control. The panel is a real full screen index, not a small dropdown or a handful of abbreviated filter choices. Selecting a decade closes the panel through navigation and reveals the new one column collection.

## Global search

Source: [Nauman search](https://metabooks.art/search?type=product&q=Nauman). Screenshots: [results](references/metabooks/11-global-search-desktop.jpg), [empty state](references/metabooks/12-search-empty-desktop.jpg).

The header search works differently from the two index inputs. Entering a query and pressing Enter navigates to `/search?type=product&q=…`. The entered word remains in the header.

The results view has a large blank interval beneath the navigation, then a compact count and query label followed by the familiar book grid. It does not include the archive’s decade and theme index. This makes it a direct search outcome, with the same visual language as the catalogue.

Results changed while the page settled. The Nauman query initially showed three matching records and ultimately displayed six cards. The browser title reported a larger search count. The visible final grid and its count are the useful reference for the rendered experience; the first response and tab title should not be treated as a stable total.

A deliberately unmatched query produced a short message in the right half of the page and a text link back to the archive. The empty page retains a great deal of white space and the complete shared footer. It avoids a large illustration or elaborate recovery form.

A brief loading message appeared before the empty result resolved. Its language differed from the rest of the English interface. That is an observed loading detail, not a necessary part of the visual direction.

## Book detail experience

Source: [Twentysix Gasoline Stations](https://metabooks.art/products/twentysix-gasoline-stations). Screenshots: [desktop record](references/metabooks/08-book-detail-desktop.jpg), [video](references/metabooks/09-book-video-desktop.jpg), [reading section](references/metabooks/10-book-description-desktop.jpg), [mobile record](references/metabooks/26-book-detail-mobile.jpg), [expanded mobile text](references/metabooks/27-book-description-mobile.jpg).

### Arrival and dominant media

A direct reload of the book page briefly displayed a large bold title, artist, and year on white before revealing the normal record. Unlike the homepage’s held opening, this product introduction cleared automatically during the observation.

The normal page starts with the same slim navigation and a very broad light gray media stage directly beneath it. At 1440 px wide, the stage is about 1420 × 600 px. The object is centered and fully visible within it. The sampled portrait cover occupies roughly 480 px of height, retaining margins above and below.

The relationship between the small UI and the large object is striking. The page offers plenty of visual space for inspection while maintaining a quiet catalogue scale for its controls.

### Image gallery

The sampled book has three media positions: front cover, back cover, and a page turning video. A small current and total counter sits below the media at the far right on desktop.

Clicking the right side of the stage advanced to the next item. The content moved horizontally. A further advance after the third position wrapped to the first. The media sequence is therefore a looping gallery. It has no visible thumbnail strip or large permanent next button in the captured resting state.

Dragging across the media from right to left at the mobile width advanced from the first to the second item. The mobile resting layout hides the desktop counter. The gesture remains available even though the interface around it is reduced.

### Page turning video

The third position plays a close view of gloved hands handling and turning the book’s pages. This extends the archive beyond cover photography. It conveys the scale, binding, paper, sequence, and act of reading the object.

The video is muted and begins playing when its slide is selected. The sampled media is approximately one minute forty seconds long. It is displayed within the broad gray stage, with a landscape viewing area around 711 × 400 px at the tested desktop size.

The custom interface provides text controls for fullscreen, playback, and elapsed time. Pausing changed the playback action to its play state and stopped the video. Fullscreen opened the browser’s native video presentation, with black surrounding space and standard native playback controls. [Fullscreen capture](references/metabooks/36-video-fullscreen-desktop.jpg).

The fullscreen capture reflects the native player’s dimensions rather than the 1440 × 1000 page viewport. Fullscreen entry and pause behavior were visibly verified. Native fullscreen exit behavior was not established reliably in the audit browser and should not be inferred from the successful entry.

### Desktop bibliographic record

Below the media, the left half is largely blank. A ruled information column begins at the midpoint. Its top stack identifies the title, artist, and year. The artist is a link back to an artist collection.

A second stack gives bibliographic details such as publisher and place, extent, dimensions, and edition information. These details remain in uppercase small monospaced text. They are treated as a compact record rather than a sequence of large labeled form fields.

The information area extends vertically well beyond the short stacks. A description marker sits near the bottom of that tall ruled space. The long interpretive text follows below, also in the right half, with a separate rule and inset.

The prose uses normal sentence case, retaining italics where needed, even though the identification above is uppercase. It is still small mono text. Paragraph breaks make the scholarly discussion readable, while the unoccupied left half reinforces the asymmetry.

The sampled historical object has no price, quantity selector, or purchase action. It is presented as a research record. The site’s policy text explicitly distinguishes the archive from newly issued publications that may be sold.

### Mobile bibliographic record

At 390 px wide, the main stage becomes a 370 px square. The title, linked artist, and year appear below it with the familiar left rule. The secondary bibliography and essay are initially collapsed.

Opening the description changes the action to close and reveals both the secondary bibliographic information and the longer essay in the full usable width. The page expands vertically. It stays within the document rather than opening a modal or lightbox.

The mobile mono text measures approximately 13.8 px with a 15.8 px line height. This is slightly larger and more open than the desktop mono text. The reading column keeps the narrow page margin and rule inset.

### Further browsing

The book page leads into a ruled related material marker and another set of cover images. On the sampled desktop page, four related cards were visibly displayed with metadata. In the mobile layout, two smaller cover fields sit side by side and their captions are hidden.

The related selection changed across visits. The visible sample gives the visitor a route into another object before reaching the footer. The exact recommendation logic was not established.

## Exhibitions

Source: [Exhibitions](https://metabooks.art/pages/exhibitions). Screenshots: [desktop overview](references/metabooks/13-exhibitions-desktop.jpg), [expanded description](references/metabooks/14-exhibition-description-desktop.jpg), [mobile](references/metabooks/29-exhibitions-mobile.jpg).

The exhibitions route begins directly with images below the navigation. Four entries appear in reverse chronological sequence, with dates of 2026, 2024, 2023, and 2022. At desktop width they form two columns and two rows. At mobile width they become one column.

Each entry consists of a large gray image field followed by a compact ruled information block. The information identifies the show, its format or venue, the year, a PDF link, and a description toggle. The same image containment and narrow gutters connect this page to the archive.

The current online presentation uses a book cover. Other entries use publication imagery or a photograph of books displayed together. These can vary in subject and aspect ratio while remaining centered in consistent fields.

Opening a description reveals an uppercase mono text block directly beneath that exhibition’s identification. The toggle changes to close. The text increases the item’s height and pushes subsequent rows downward. At desktop width, the neighboring column can remain mostly empty beside the expanded text. The layout does not fill that gap with another card.

Clicking the sampled exhibition image itself did not navigate or open a separate viewer. The PDF link is the principal way to enter the full downloadable presentation. Following the first link opened its PDF in a new browser tab, leaving the exhibitions route in place.

On mobile, the PDF action aligns at the right of the identification area while the show’s title, venue or format, and year occupy the left. The description action follows below. Expanding it inserts the same long text into the single column flow.

## About and support

Source: [About](https://metabooks.art/pages/information). Screenshots: [desktop](references/metabooks/15-about-desktop.jpg), [intermediate](references/metabooks/31-about-medium.jpg), [mobile](references/metabooks/30-about-mobile.jpg), [support destination](references/metabooks/16-support-options-desktop.jpg).

The About page is almost entirely typographic. On desktop it has two equal columns, beginning after a substantial white gap beneath the navigation. Each column starts with a fine left rule and an inset small label.

The first column explains the collection and its public research purpose. The second explains the publishing imprint and its relation to the collection. Contributor names and roles sit low in the second column, separated from the prose by open space. The left column ends with a thin bordered support action.

The paragraphs use uppercase mono type at the same compact scale as the catalogue. There are no portraits, illustrated statistics, testimonials, or large section headlines. The content and column placement establish the institution’s scope.

At 800 px, these two columns remain side by side and become denser as the lines shorten. At 390 px, the material stacks into one column, with the collection explanation first and the publishing explanation and contributor details below it. The vertical rules and page insets remain.

The support action navigated in the same tab to a PayPal donation page. That external page offered a custom euro amount, frequency choices, and PayPal or card payment routes. No donation was entered or submitted. The switch to PayPal introduces a visibly different interface and ends the site’s own visual system for that flow.

## Publications and cart

Sources: [Publication](https://metabooks.art/collections/publications/products/meta-publication-no-1), [Cart](https://metabooks.art/cart). Screenshots: [publication](references/metabooks/17-publication-desktop.jpg), [empty cart](references/metabooks/18-empty-cart-desktop.jpg).

The main Publications destination leads directly to the first publication’s product record. During this audit it did not lead to a grid of available editions.

The page uses the same broad gray media stage as a book detail. Its displayed artwork is a cream announcement sheet. The artwork gives a spring 2027 timeframe, while the adjacent product information specifies March 2027. Those are the live page’s release statements as observed on November 2, 2026.

Below the stage, an outlined disabled sale action occupies the left quarter of the desktop view. The title and forthcoming status begin in the right half, and a one of one media count appears at the far right. A long, mostly empty information area continues down to the footer.

This is a real unavailable product state. It does not establish how an available item’s variants, quantity controls, cart updates, or checkout would behave. The sale action could not be exercised in its disabled state.

The cart route is a full page, rather than a slideout drawer. Its empty state places a brief text message and return route in the right half, surrounded by ample white space. The header still shows a zero count, and the normal footer follows below. No item was added and no checkout was initiated.

## Shared footer

Screenshots: [desktop colophon](references/metabooks/04-footer-colophon-desktop.jpg), [mobile footer](references/metabooks/28-footer-mobile.jpg).

On desktop, the footer occupies the right half of the page. A large bold sans serif site name sits at its top. The left half remains empty. The footer is not a dark band and does not span the page with a contrasting background.

Below the name, three vertically separated ruled blocks contain newsletter and contact information, legal links, and the colophon. The first block has a conspicuously tall blank area above the newsletter form. The form uses a plain email input and text submit action. Email and Instagram links sit below it.

The legal block places two compact links near its lower edge. The colophon block repeats the tall ruled pause, with the action near the bottom. These blocks make the footer feel like a continuation of the catalogue’s spacing system.

Opening the colophon changes its action to close and inserts small uppercase content and website credits inline. It does not open a modal, add a backdrop, or navigate to another page.

On mobile, the footer becomes full width and starts at the left page margin. The bold name is about 30 px. The long ruled gaps remain, so the footer still takes a substantial vertical distance despite its small amount of information. The newsletter, contact links, legal links, and colophon retain their order.

The newsletter field and action were inspected without submitting an address. No subscription success, error, or validation state is claimed here. The email link uses a mail destination; Instagram leads to the platform’s external profile.

## Legal page templates

Sources: [Terms](https://metabooks.art/pages/terms-and-conditions), [Privacy](https://metabooks.art/pages/privacy-policy). Screenshots: [terms](references/metabooks/19-terms-desktop.jpg), [privacy](references/metabooks/20-privacy-desktop.jpg).

Both legal pages reuse the header, white background, small uppercase mono text, fine rules, and shared footer. Their long text is concentrated in the right half on desktop, with the left half intentionally empty.

Headings are expressed through spacing and text within the same small typographic register. Paragraphs use substantial breaks. The document begins well below the top header and continues as a long normal scroll, without a separate table of contents or sticky section navigator.

At the tested desktop size, the terms document was approximately 3590 px tall and the privacy document approximately 1769 px tall. Their importance to the visual system is consistency: even dense administrative content adopts the same offset reading column as the book essay.

## Measured visual vocabulary

These values describe the rendered reference, not proposed values for Studio Lab BH. The [desktop measurement snapshot](references/metabooks/desktop-measurements.json) preserves a sample of the observed geometry.

| Element | Observed treatment |
| --- | --- |
| Page surface | Plain white, with no visible texture |
| Image field | `#f6f6f6` |
| Primary text | Black |
| Muted text and rules | `#9d9d9d` in sampled computed styles |
| Desktop utility and catalogue face | Courier New, 13 px, 13.8 px line height, approximately 0.3 px tracking |
| Mobile utility and catalogue face | Courier New, approximately 13.8 px, 15.8 px line height |
| Desktop opening face | `Unica_77LL-Bold`, 38 px, 38 px line height, approximately −1.3 px tracking |
| Mobile opening and menu face | `Unica_77LL-Bold`, approximately 30 px, 32 px line height |
| Desktop header height | Approximately 33.8 px |
| Narrow header height | Approximately 35.8 px |
| Main outer horizontal margin | 10 px |
| Main image gutters | 10 px |
| Desktop archive image field | 347.5 × 347.5 px at a 1440 px viewport |
| Intermediate archive image field | 385 × 385 px at an 800 px viewport |
| Mobile archive image field | 370 × 370 px at a 390 px viewport |
| Desktop object media stage | Approximately 1420 × 600 px |
| Homepage desktop feature stage | Approximately 1420 × 400 px |
| Metadata rule | 1 px left border with 10 px text inset |
| Corners | Square throughout the sampled site UI |
| Shadow treatment | No visible raised card shadows in the sampled site UI |

The key relationships matter as much as the values. Image fields sit on a four, two, or one column grid. Reading and footer content repeatedly start at the desktop midpoint. Small type aligns to the same left inset as other records. Empty space is often enclosed by a single vertical line instead of a box.

## Motion and interaction language

The site uses a small set of motions with distinct purposes. The opening moves upward to reveal content; page content briefly fades during navigation; the mobile menu and search panel move into place; object media travel horizontally; expanding text increases document height.

The header remains visually stable through ordinary scrolling. It supplies orientation while the page’s images and large blank intervals pass beneath it. Pagination returns to the top and changes the URL. An exhibition PDF branches into a new tab. A donation route hands the visitor to another service.

Many controls are simply words in the same small type as the metadata. Input fields have no enclosing border. The more conventional thin outlined buttons are limited in the sampled views to actions such as support and the forthcoming sale state. Large iconography is not doing the work of explaining the interface.

Hover appearance and custom pointer behavior were not independently verified. Exact animation durations, easing curves, touch momentum, and reduced motion behavior were not measured. The observations above describe the visible transitions and tested outcomes without specifying an unobserved animation implementation.

## Responsive comparison

| Area | Wide desktop at 1440 px | Intermediate at 800 px | Narrow at 390 px |
| --- | --- | --- | --- |
| Main navigation | Full text row, global search, cart | Full text row and global search retained | Site name, menu toggle, cart |
| Homepage opening | Name and long mission statement | Long mission statement observed in the initial 800 px view | Name alone |
| Archive index | Four columns above grid | Two columns above grid | Separate panel entered from bottom search row |
| Archive books | Four columns | Two columns | One column |
| Small homepage books | Four captioned columns | Not separately established | Two columns without captions |
| Main object media | Broad horizontal stage | Broad stage retained in the restored 800 px view | Square stage |
| Object text | Offset right, full bibliography and essay | Right half retained | Full width with description initially collapsed |
| Exhibitions | Two columns | Not separately established | One column |
| About | Two columns | Two columns | One column |
| Footer | Right half | Right half | Full width |

## Implications for Studio Lab BH

This section interprets the reference for the existing site. It is a description of a possible design direction, not a record of changes already applied.

### Structure worth preserving in a translation

A strong adaptation would begin with a clear studio statement and then move into actual work with a consistent catalogue identity. Work records would need dependable titles, categories or creators, and dates. The object fields would need carefully prepared imagery with deliberate containment, rather than arbitrary cover crops.

The recurring midpoint is especially useful: featured work can span the page, while identification, supporting research, and footer content begin in the right half. The same grid can organize project lists, individual project essays, research entries, and administrative pages.

The reference also separates quick browsing from deeper reading. A visitor can follow an image immediately, enter an archive through taxonomy, search for a known item, or expand text when they need detail. Studio Lab BH already has research content and expandable Project Details that could support that distinction.

### Content mappings to consider

| Metabooks role | Possible Studio Lab BH role |
| --- | --- |
| Introductory institution statement | Concise studio purpose |
| Featured book | Featured project or research work |
| Collection | Work archive |
| Artist grouping | Discipline, project family, collaborator, or subject grouping |
| Decade navigation | Years or periods relevant to the studio’s actual output |
| Theme taxonomy | A small authored set of research and practice themes |
| Bibliographic record | Project facts, roles, tools, year, and context |
| Book description | Project essay and expanded research |
| Exhibition programme | Exhibitions, workshops, installations, or selected presentations |
| Publishing destination | Publications or released tools, if they warrant a separate section |
| Page turning video | Process footage or an authored demonstration |

These are functional mappings. The target’s book metadata, inventory counts, commerce states, and publishing schedule belong to its own content model. Studio Lab BH’s version would need its own truthful records and navigation priorities.

### Existing direction that this reference would change

The current [design principles](design-principles.md) establish a near-black shared atmosphere, Orbitron branding, Inter and Plex Mono typography, a 14 px minimum for compact UI, a four pixel spacing scale, and project imagery without carousels. Metabooks instead uses a plain white surface, a different bold face and Courier New, smaller desktop type, 10 px gutters, gray object fields, and looping media galleries.

Adopting the reference closely therefore changes several foundational choices together. The new direction would need to be reflected in those shared principles and global definitions when implementation begins. The existing contract that page backgrounds belong to the root layout remains a useful implementation rule: a light direction should still be shared globally rather than introduced as separate per-route backgrounds.

### Details that deserve deliberate treatment

The held opening, very small desktop type, hidden captions on mobile thumbnail groups, and minimally signposted gallery controls are all part of the observed reference. Each has a visible aesthetic effect and a practical effect on discovery or reading. A close translation should make an explicit choice about them rather than reproducing them accidentally.

The largest content dependency is the imagery. The reference’s gray stages work because the photographed objects are consistently isolated, proportioned, and framed. Studio Lab BH’s photographs, diagrams, interfaces, and artworks have different needs. Their intrinsic canvas colors and meaningful content would need to survive any common presentation system.

## Exploration record and scope

The following routes and states were directly inspected:

| Destination or state | Actions and outcomes |
| --- | --- |
| Homepage | Observed opening at wide and narrow widths, tested scroll and click entry, returned through site name, scrolled through feature, book sample, exhibitions, and footer |
| Collection | Inspected desktop, intermediate, and mobile layouts; scrolled through records and pagination |
| Artist lookup | Entered a surname and followed the suggestion to a 21 item artist group |
| Title lookup | Entered a title fragment and followed the direct book suggestion |
| Decade grouping | Opened the 1960s group; inspected pages 2 and 3; followed a pagination link |
| Theme grouping | Opened Architecture and inspected its six item result |
| Global search | Submitted a matching query and an unmatched query; observed settled results and recovery state |
| Book record | Inspected bibliography and essay, advanced media, verified wraparound, dragged the mobile gallery, opened and closed mobile description |
| Book video | Verified muted playback, pause state, and native fullscreen entry |
| Exhibitions | Inspected all four entries, expanded a description at desktop and mobile widths, tested image click, followed a PDF into a new tab |
| About | Inspected wide, intermediate, and mobile layouts; followed support to the external donation screen |
| Publications | Inspected forthcoming product and disabled sale state |
| Cart | Opened the empty cart page |
| Footer | Inspected desktop and mobile; expanded inline colophon; inspected newsletter and external link destinations |
| Legal pages | Opened terms and privacy templates and inspected their reading layout |

The audit does not assert an available purchase flow, completed subscription, payment outcome, full keyboard accessibility, physical device behavior, or complete coverage of the 546 item collection. It records representative routes and the primary interface families visible in the live site.

Only documentation and reference screenshots were added to the Studio Lab BH repository for this phase. Production pages, styles, content, and design principles were not changed.

## Screenshot index

All captures are in [the reference directory](references/metabooks/). The fullscreen image uses native player dimensions; the full archive capture is taller than a viewport.

| Number | View |
| --- | --- |
| [01](references/metabooks/01-home-opening-desktop.jpg) | Desktop homepage opening |
| [02](references/metabooks/02-home-catalogue-desktop.jpg) | Revealed desktop homepage |
| [03](references/metabooks/03-home-exhibitions-footer-desktop.jpg) | Homepage exhibition section |
| [04](references/metabooks/04-footer-colophon-desktop.jpg) | Desktop footer with colophon expanded |
| [05](references/metabooks/05-collection-grid-desktop.jpg) | Desktop collection overview |
| [06](references/metabooks/06-collection-artist-search-desktop.jpg) | Artist lookup suggestion |
| [07](references/metabooks/07-artist-collection-desktop.jpg) | Artist collection |
| [08](references/metabooks/08-book-detail-desktop.jpg) | Desktop book record |
| [09](references/metabooks/09-book-video-desktop.jpg) | Page turning video |
| [10](references/metabooks/10-book-description-desktop.jpg) | Book essay and related material |
| [11](references/metabooks/11-global-search-desktop.jpg) | Settled global search results |
| [12](references/metabooks/12-search-empty-desktop.jpg) | Empty search state |
| [13](references/metabooks/13-exhibitions-desktop.jpg) | Desktop exhibition grid |
| [14](references/metabooks/14-exhibition-description-desktop.jpg) | Expanded exhibition text |
| [15](references/metabooks/15-about-desktop.jpg) | Desktop About page |
| [16](references/metabooks/16-support-options-desktop.jpg) | External donation destination |
| [17](references/metabooks/17-publication-desktop.jpg) | Forthcoming publication |
| [18](references/metabooks/18-empty-cart-desktop.jpg) | Empty cart |
| [19](references/metabooks/19-terms-desktop.jpg) | Terms layout |
| [20](references/metabooks/20-privacy-desktop.jpg) | Privacy layout |
| [21](references/metabooks/21-home-opening-mobile.jpg) | Mobile opening |
| [22](references/metabooks/22-home-catalogue-mobile.jpg) | Mobile homepage catalogue |
| [23](references/metabooks/23-mobile-menu.jpg) | Expanded mobile menu |
| [24](references/metabooks/24-collection-mobile.jpg) | Mobile archive |
| [25](references/metabooks/25-mobile-collection-search.jpg) | Mobile search panel |
| [26](references/metabooks/26-book-detail-mobile.jpg) | Collapsed mobile book record |
| [27](references/metabooks/27-book-description-mobile.jpg) | Expanded mobile book record |
| [28](references/metabooks/28-footer-mobile.jpg) | Mobile footer |
| [29](references/metabooks/29-exhibitions-mobile.jpg) | Mobile exhibitions |
| [30](references/metabooks/30-about-mobile.jpg) | Mobile About page |
| [31](references/metabooks/31-about-medium.jpg) | About at 800 px |
| [32](references/metabooks/32-collection-medium.jpg) | Collection at 800 px |
| [33](references/metabooks/33-pagination-desktop.jpg) | Desktop pagination and footer |
| [34](references/metabooks/34-theme-collection-desktop.jpg) | Thematic collection |
| [35](references/metabooks/35-collection-full-desktop.jpg) | Full desktop collection page |
| [36](references/metabooks/36-video-fullscreen-desktop.jpg) | Native fullscreen video |
