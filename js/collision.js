// Collisions between aligned rectangles
function rectsOverlap(firstRect, secondRect) {

    if ((firstRect.x > (secondRect.x + secondRect.width)) ||((firstRect.x + firstRect.width) < secondRect.x))
        return false; // No horizontal axis projection overlap
    if ((firstRect.y > (secondRect.y + secondRect.height)) || ((firstRect.y + firstRect.height) < secondRect.y))
        return false; // No vertical axis projection overlap
    return true;    // If previous tests failed, then both axis projections
    // overlap and the rectangl es intersect
}


export { rectsOverlap}