function squared_distance(x1, y1, x2, y2)
{
    return (x2 - x1) ** 2 + (y2 - y1) ** 2;
}

function segments_intersect(x1, y1, x2, y2, x3, y3, x4, y4) 
{
    function cross_product(x1, y1, x2, y2) {
        return x1 * y2 - x2 * y1;
    }

    let a = cross_product(x2 - x1, y2 - y1, x3 - x1, y3 - y1) * 
        cross_product(x2 - x1, y2 - y1, x4 - x1, y4 - y1);
    let b = cross_product(x4 - x3, y4 - y3, x1 - x3, y1 - y3) * 
        cross_product(x4 - x3, y4 - y3, x2 - x3, y2 - y3);
    if (a <= 0 && b <= 0) {
        if (a == 0 && b == 0) {
            // оставим на потом)
            return false;
        }
        return true;
    }
    return false;
}

function setStyles(elem, style) {
    for (let prop in style) {
        elem.style[prop] = style[prop]
    }
}

function addElement(parent, tag, style, opt)
{
    let elem = document.createElement(tag);
    for (let prop in opt) {
        elem.setAttribute(prop, opt[prop]);
    }
    setStyles(elem, style);
    parent.append(elem);
    return elem;
}

function fromInterval(x, L, R) {
    x = Math.min(x, R);
    x = Math.max(x, L);
    return x;
}
