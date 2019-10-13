function segments_intersect(x1, y1, x2, y2, x3, y3, x4, y4) 
{
    function cross(x1, y1, x2, y2) {
        return x1 * y2 - x2 * y1;
    }

    let a = cross(x2 - x1, y2 - y1, x3 - x1, y3 - y1) * 
        cross(x2 - x1, y2 - y1, x4 - x1, y4 - y1);
    let b = cross(x4 - x3, y4 - y3, x1 - x3, y1 - y3) * 
        cross(x4 - x3, y4 - y3, x2 - x3, y2 - y3);
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


class ChainField
{
    constructor(opt = {})
    {
        let table = this;
        function setProp(property, value) {
            if (opt[property] === undefined) {
                table[property] = value;
            }
            else {
                table[property] = opt[property];
            }
        }

        this.sizeX = 0;
        this.sizeY = 0;
        this.points = new Array();
        this.games_cnt = 0;

        setProp('id', 'main');
        setProp('onchange', function(table) {});

        setProp('segment_height', 15);
        setProp('segment_color', 'green');
        setProp('delete_segment_color', this.segment_color);

        setProp('node_radius', 15);
        setProp('clickable_node_radius', this.node_radius);
        setProp('node_border_radius', 0);
        setProp('node_color', 'green');
        setProp('node_border_color', this.node_color);
        setProp('hover_node_color', 'grey');
        setProp('used_node_color', this.node_color);
        setProp('used_node_border_color', this.used_node_color);
        setProp('start_node_color', 'red');
        setProp('end_node_color', 'black');
        setProp('delete_node_color', this.node_color);
        setProp('first_delete_node_color', this.delete_node_color);
        setProp('covered_node', 0);

        setProp('show_grid', false);
        setProp('grid_color', 'black');
        setProp('grid_width', 3);
        setProp('gridStep', 60);
        setProp('minGridStep', this.node_radius * 2);
        setProp('maxGridStep', Infinity);

        setProp('maxWidth', Infinity);
        setProp('minWidth', 0);
        setProp('maxHeight', Infinity);
        setProp('minHeight', 0);

        setProp('background_color', 'transparent');
        setProp('background_border', 0);

        setProp('show_score', true);
    }

    static drawSegmentAnimation(table, x1, y1, x2, y2)
    {
        let xc = (x1 + x2) / 2, yc = (y1 + y2) / 2;
        let ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        let len = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2) + 
            table.segment_height;

        addElement(segments, 'div',
            {
                background: table.segment_color,
                transform: `rotate(${ang}deg)`,
                width: `${len}px`,
                height: `${table.segment_height}px`,
                top: `${yc + table.node_radius - 
                    table.segment_height / 2 + 
                    table.background_border}px`,
                left: `${xc - len / 2 + 
                    table.node_radius + 
                    table.background_border}px`,
                'border-radius': `${table.segment_height / 2}px`,
            },
            {
                id: `segment_${table.id}_${table.lines_cnt}`,
                class: `segment`,
            }
        );
    }

    static drawSegmentLinearAnimation(table, x1, y1, x2, y2)
    {
        table.make_busy();
        let ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        let segment = addElement(segments, 'div',
            {
                background: table.segment_color,
                transform: `rotate(${ang}deg)`,
                height: `${table.segment_height}px`,
                'border-radius': `${table.segment_height / 2}px`,
            },
            {
                id: `segment_${table.id}_${table.lines_cnt}`,
                class: `segment`,
            }
        );

        function timer(t) {
            if (t >= 1.05) {
                table.not_busy();
                return;
            }
            setTimeout(() => timer(t + 0.1), 20);
            let xc = x1 * (1 - t) + ((x1 + x2) / 2) * t;
            let yc = y1 * (1 - t) + ((y1 + y2) / 2) * t;
            let len = (Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2) + 
                table.segment_height) * t;

            segment.style.width = `${len}px`;
            segment.style.top = `${yc + table.node_radius - 
                table.segment_height / 2 + 
                table.background_border}px`;
            segment.style.left = `${xc - len / 2 + 
                table.node_radius + 
                table.background_border}px`;
        }
        timer(0);
    }

    static drawSegmentAlexAnimation(table, x1, y1, x2, y2)
    {
        table.make_busy();
        let ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        let segment = addElement(segments, 'div',
            {
                background: table.segment_color,
                transform: `rotate(${ang}deg)`,
                height: `${table.segment_height}px`,
            },
            {
                id: `segment_${table.id}_${table.lines_cnt}`,
                class: `segment`,
            }
        );

        function timer(t) {
            if (t >= 1.05) {
                table.not_busy();
                return;
            }
            setTimeout(() => timer(t + 0.05), 10);
            let xc = x1 * (1 - t) + ((x1 + x2) / 2) * t;
            let yc = y1 * (1 - t) + ((y1 + y2) / 2) * t;
            let len1 = (Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2) +
                table.segment_height) * 1;
            let len2 = (Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2) +
                table.segment_height) * t;

            segment.style.width = `${len2}px`;
            segment.style.top = `${yc + table.node_radius - 
                table.segment_height / 2 + 
                table.background_border}px`;
            segment.style.left = `${xc - len1 / 2 + 
                table.node_radius +
                table.background_border}px`;
            // console.log(segment.style.top);
        }
        timer(0);
    }

    static destroySegmentAnimation(table, N)
    {
        segments.removeChild(table.segment(table.lines_cnt - 1));
        table.update_score();
        table.update_colors();
        table.onchange();
        if (N > 1) { 
            ChainField.destroySegmentAnimation(table, N - 1);
        }
    }

    static destroySegmentLinearAnimation(table, N, _past = 0)
    {
        table.make_busy();
        let segment = table.segment((table.lines_cnt - 1));
        let x2 = table.points[table.lines_cnt][0] * table.gridStep; 
        let y2 = table.points[table.lines_cnt][1] * table.gridStep;
        let x1 = table.points[table.lines_cnt - 1][0] * table.gridStep; 
        let y1 = table.points[table.lines_cnt - 1][1] * table.gridStep;

        function timer(t) {
            if (t == 1) {
                table.points.pop();
                table.update_colors();
            }
            if (t <= 0) {
                segments.removeChild(table.segment(table.lines_cnt));
                table.update_score();
                table.update_colors();
                table.onchange();
                if (N > 1) {
                    ChainField.destroySegmentLinearAnimation(
                        table, N - 1, _past + 1);
                }
                else {
                    table.not_busy();
                }
                return;
            }
            setTimeout(function() {
                timer(t - 0.1 * (1 + Math.min(N - t, _past + t)));
            }, 20);
            let xc = x1 * (1 - t) + ((x1 + x2) / 2) * t; 
            let yc = y1 * (1 - t) + ((y1 + y2) / 2) * t;
            let len = (Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2) + 
                table.segment_height) * t;

            segment.style.width = `${len}px`;
            segment.style.top = `${yc + table.node_radius - 
                table.segment_height / 2 + 
                table.background_border}px`;
            segment.style.left = `${xc - len / 2 + 
                table.node_radius + 
                table.background_border}px`;
        }
        timer(1);
    }

    static destroySegmentAlexAnimation(table, N)
    {
        table.make_busy();
        let segment = table.segment((table.lines_cnt - 1));
        let x2 = table.points[table.lines_cnt][0] * table.gridStep; 
        let y2 = table.points[table.lines_cnt][1] * table.gridStep;
        let x1 = table.points[table.lines_cnt - 1][0] * table.gridStep; 
        let y1 = table.points[table.lines_cnt - 1][1] * table.gridStep;

        function timer(t) {
            if (t == 1) {
                table.points.pop();
                table.update_colors();
            }
            if (t <= 0) {
                segments.removeChild(table.segment(table.lines_cnt));
                table.update_score();
                table.update_colors();
                table.onchange();
                if (N > 1) {
                    ChainField.destroySegmentAlexAnimation(table, N - 1);
                }
                else {
                    table.not_busy();
                }
                return;
            }
            setTimeout(function() {
                timer(t - 0.1 * (1 + Math.min(N - t, N - t)));
            }, 20);
            let xc = x1 * (1 - t) + ((x1 + x2) / 2) * t; 
            let yc = y1 * (1 - t) + ((y1 + y2) / 2) * t;
            let len = (Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2) + 
                table.segment_height) * t;

            segment.style.width = `${len}px`;
            segment.style.top = `${yc + table.node_radius - 
                table.segment_height / 2 + 
                table.background_border}px`;
        }
        timer(1);
    }

    static pulseNodeAnimation(color, time, finalRadius)
    {
        return function(node) {
            function timer(t) {
                if (t <= 0) {
                    node.style.boxShadow = 'none';
                    return;
                }
                setTimeout(function() {
                    timer(t - 20 / time)
                }, 20);
                node.style.boxShadow = `0 0 0 ${finalRadius * (1 - t**1.5)}px` +
                    ` rgba(${color[0]}, ${color[1]}, ${color[2]}, ${t})`;
            }
            timer(1)
        }
    }

    make_busy() {
        this.busy = true;
    }

    not_busy() {
        this.busy = false;
    }

    segment(n) {
        return document.getElementById(`segment_${this.id}_${n}`);
    }

    node(x, y) {
        return document.getElementById(`node_${this.id}_${x}_${y}`);
    }

    clicknode(x, y) {
        return document.getElementById(`clicknode_${this.id}_${x}_${y}`);
    }

    gridline(dir, x) {
        return document.getElementById(`gridline_${this.id}_${dir}${x}`);
    }

    get lines_cnt() {
        return this.points.length - 1;
    }

    get win() {
        return this.end_point[0] == this.last_point[0] &&
            this.end_point[1] == this.last_point[1];
    }

    get width() {
        return this.sz * (this.sizeX - 1) + 
            2 * this.node_radius + 
            2 * this.background_border;
    }

    get height() {
        return this.sz * (this.sizeY - 1) + 
            2 * this.node_radius + 
            2 * this.background_border; 
    }

    get last_point() {
        return [
            this.points[this.lines_cnt][0],
            this.points[this.lines_cnt][1]
        ]
    }

    update_colors()
    {
        for (let x = 0; x < this.sizeX; ++x) {
            for (let y = 0; y < this.sizeY; ++y) {
                this.node(y, x).style.background = this.node_color;
                this.node(y, x).style.borderColor = this.node_border_color;
            }
        }

        for (let point of this.points) {
            this.node(point[1], point[0]).style.background = 
                this.used_node_color;
            this.node(point[1], point[0]).style.borderColor = 
                this.used_node_border_color;
        }

        for (let n = 0; n < this.lines_cnt; n++) {
            this.segment(n).style.background = this.segment_color;
        }

        if (this.covered_node) {
            let n = this.find_node(this.covered_node[0], this.covered_node[1]);
            if (n != this.lines_cnt) {
                let x = this.covered_node[0], y = this.covered_node[1];
                if (n == -1) {
                    this.node(y, x).style.background = this.hover_node_color;
                }
                else {
                    n++;
                    this.node(y, x).style.background = 
                        this.first_delete_node_color;
                    for (; n < this.points.length; n++) {
                        this.node(this.points[n][1], this.points[n][0]).
                            style.background = this.delete_node_color;
                        this.segment(n - 1).style.background = 
                            this.delete_segment_color;
                    }
                }
            }
        }
        if (this.start_point) {
            this.node(this.start_point[1], this.start_point[0]).
                style.background = this.start_node_color;
        }
        if (this.end_point) {
            this.node(this.end_point[1], this.end_point[0]).
                style.background = this.end_node_color;
        }
    }

    update_positions()
    {
        for (let i = 0; i < this.sizeY; ++i) {
            for (let j = 0; j < this.sizeX; ++j) {
                let y_pos = i * this.gridStep, x_pos = j * this.gridStep;
                setStyles(this.node(i, j),
                    {
                        top: `${y_pos + this.background_border}px`,
                        left: `${x_pos + this.background_border}px`,
                    }
                );
            }
        }
        for (let i = 0; i < this.sizeY; ++i) {
            for (let j = 0; j < this.sizeX; ++j) {
                let y_pos = i * this.gridStep, x_pos = j * this.gridStep;
                setStyles(this.clicknode(i, j),
                    {
                        top: `${y_pos - this.clickable_node_radius + 
                            this.node_radius + this.background_border}px`,
                        left: `${x_pos - this.clickable_node_radius + 
                            this.node_radius + this.background_border}px`,
                    }
                );
            }
        }
        for (let n = 0; n < this.lines_cnt; ++n) {
            let x1 = this.points[n][0]*this.gridStep
            let y1 = this.points[n][1]*this.gridStep;
            let x2 = this.points[n + 1][0]*this.gridStep;
            let y2 = this.points[n + 1][1]*this.gridStep; 
            let xc = (x1 + x2) / 2, yc = (y1 + y2) / 2;
            let ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
            let len = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2) + 
                this.segment_height;
            setStyles(this.segment(n),
                {
                    transform: `rotate(${ang}deg)`,
                    width: `${len}px`,
                    height: `${this.segment_height}px`,
                    top: `${yc + this.node_radius - 
                        this.segment_height / 2 + 
                        this.background_border}px`,
                    left: `${xc - len / 2 + 
                        this.node_radius + 
                        this.background_border}px`,
                }
            );
        }
        if (this.show_grid) {
            for (let i = 0; i < this.sizeY; ++i) {
                setStyles(this.gridline('y', i),
                    {
                        top: `${i * this.gridStep + this.node_radius - 
                            this.grid_width / 2 + this.background_border}px`,
                        left: `${this.node_radius - this.grid_width / 2 + 
                            this.background_border}px`,
                        width: `${(this.sizeX - 1) * this.gridStep + 
                            this.grid_width}px`,
                        height: `${this.grid_width}px`,
                    }
                );
            }
            for (let j = 0; j < this.sizeX; ++j) {
                setStyles(this.gridline('x', j), 
                    {
                        left: `${j * this.gridStep + this.node_radius - 
                            this.grid_width / 2 + this.background_border}px`,
                        top: `${this.node_radius - this.grid_width / 2 + 
                            this.background_border}px`,
                        height: `${(this.sizeY - 1) * this.gridStep + 
                            this.grid_width}px`,
                        width: `${this.grid_width}px`,
                    }
                );  
            }
        }
    }

    update_background()
    {
        field.style.width = `${this.gridStep * (this.sizeX - 1) + 
            this.node_radius * 2 + this.background_border * 2}px`;
        field.style.height = `${this.gridStep * (this.sizeY - 1) + 
            this.node_radius * 2 + this.background_border * 2}px`;
        field.style.background = this.background_color;
        field.style.border = `${this.background_border} solid ` + 
            `${this.background_color}`;
    }

    resize(xLength, yLength)
    {
        xLength = fromInterval(xLength, this.minWidth, this.maxWidth);
        yLength = fromInterval(yLength, this.minHeight, this.maxHeight);
        let xGridStep = (xLength - 2 * this.node_radius - 
            2 * this.background_border) / (this.sizeX - 1);
        let yGridStep = (yLength - 2 * this.node_radius - 
            2 * this.background_border) / (this.sizeY - 1);
        this.gridStep = Math.min(
            fromInterval(xGridStep, this.minGridStep, this.maxGridStep),
            fromInterval(yGridStep, this.minGridStep, this.maxGridStep));
        this.update_positions();
        this.update_background();
    }

    tie_to_parent()
    {
        let table = this;
        document.body.onresize = function() {
            let parWidth = field.parentNode.clientWidth;
            console.log(parWidth);
            table.resize(parWidth, Infinity);   
        }
        document.body.onresize();
    }

    update_score()
    {
        if (this.show_score) {
            score.innerText = this.lines_cnt;
        }
    }

    find_node(x, y)
    {
        for (let i = 0; i < this.points.length; i++) {
            let node = this.points[i];
            if (node[0] == x && node[1] == y) {
                return i;
            }
        }
        return -1;
    }

    clear_segments(no_update = false)
    {
        let for_delete = [];
        for (let child of segments.children) {
            if (child.getAttribute('id').startsWith(`segment_${this.id}_`)) {
                for_delete.push(child)
            }
        }
        for (let child of for_delete) {
            segments.removeChild(child);
        }
        if (!no_update) {
            this.points = [this.start_point];
            this.onchange();
            this.update_score();
            this.update_colors();
        }
    }

    clear_nodes()
    {
        let for_delete = []
        for (let child of nodes.children) {
            if (child.getAttribute('id').startsWith(`node_${this.id}_`) || 
                child.getAttribute('id').startsWith(`clicknode_${this.id}_`)) {
                for_delete.push(child);
            }
        }
        for (let child of for_delete) {
            nodes.removeChild(child);
        }
    }

    clear_grid()
    {
        let for_delete = []
        for (let child of grid.children) {
            if (child.getAttribute('id').startsWith(`gridline_${this.id}_`)) {
                for_delete.push(child);
            }
        }
        for (let child of for_delete) {
            grid.removeChild(child);
        }
    }

    clear_table()
    {
        this.clear_segments();
        this.points = [this.start_point];
        this.onchange();
        this.update_score();
        this.update_colors();
    }

    delete_table()
    {
        this.clear_segments(true);
        this.clear_nodes();
        this.clear_grid();
        this.points = [this.start_point];
        this.onchange();
        this.update_score();
    }

    static cfKnightGame(x, y, table)
    {
        if (table.destroy_segments(x, y, 
            ChainField.destroySegmentLinearAnimation)) {
            return;
        }
        for (let n = 1; n <= table.lines_cnt; n++) {
            if (segments_intersect(x, y, ...table.last_point,
                table.points[n - 1][0], table.points[n - 1][1],
                table.points[n][0], table.points[n][1])) {
                ChainField.pulseNodeAnimation([256, 0, 0], 3000, 100000)(table.node(y, x));
                return;
            }
        }
        if ((x - table.last_point[0]) ** 2 + (y - table.last_point[1]) ** 2 != 5) {
            ChainField.pulseNodeAnimation([256, 0, 0], 3000, 100000)(table.node(y, x));
            return;
        }
        table.add_segment(x, y, ChainField.drawSegmentLinearAnimation);
    }

    generate_table(x, y, 
        start_point = [0, 0], end_point = [x - 1, y - 1],
        cf = ChainField.cfKnightGame)
    {
        this.points = [this.start_point];
        this.start_point = [Math.min(start_point[0], x - 1), 
            Math.min(start_point[1], y - 1)];
        this.end_point = [Math.min(end_point[0], x - 1), 
            Math.min(end_point[1], y - 1)];
        this.sizeX = x; this.sizeY = y;
        this.not_busy();
        this.delete_table();
        
        if (this.show_grid) {
            for (let i = 0; i < y; ++i) {
                addElement(grid, 'div', 
                    {
                        top: `${i * this.gridStep + this.node_radius - 
                            this.grid_width/2 + this.background_border}px`,
                        left: `${this.node_radius - this.grid_width / 2 + 
                            this.background_border}px`,
                        background: this.grid_color,
                        width: `${(this.sizeX - 1) * this.gridStep + 
                            this.grid_width}px`,
                        height: `${this.grid_width}px`,
                    },
                    {
                        id: `gridline_${this.id}_y${i}`,
                        class: `grid`,
                    }
                );  
            }
            for (let j = 0; j < x; ++j) {
                addElement(grid, 'div', 
                    {
                        left: `${j * this.gridStep + this.node_radius - 
                            this.grid_width/2 + this.background_border}px`,
                        top: `${this.node_radius - this.grid_width / 2 + 
                            this.background_border}px`,
                        background: this.grid_color,
                        height: `${(this.sizeY - 1) * this.gridStep + 
                            this.grid_width}px`,
                        width: `${this.grid_width}px`,
                    },
                    {
                        id: `gridline_${this.id}_x${j}`,
                        class: `grid`,
                    }
                );  
            }
        }

        for (let i = 0; i < y; ++i) {
            for (let j = 0; j < x; ++j) {
                let y_pos = i * this.gridStep, x_pos = j * this.gridStep;
                addElement(nodes, 'div',
                    {
                        top: `${y_pos + this.background_border}px`,
                        left: `${x_pos + this.background_border}px`,
                        background: this.node_color,
                        width: `${(this.node_radius) * 2}px`,
                        height: `${(this.node_radius) * 2}px`,
                        borderWidth: `${this.node_border_radius}px`,
                        border: `${this.node_border_radius}px solid ` + 
                            `${this.node_border_color}`
                    },
                    {
                        id: `node_${this.id}_${i}_${j}`,
                        class: `node`,
                    }
                );
            }
        }
        for (let i = 0; i < y; ++i) {
            for (let j = 0; j < x; ++j) {
                let y_pos = i * this.gridStep, x_pos = j * this.gridStep;
                let node = addElement(nodes, 'div',
                    {
                        top: `${y_pos - this.clickable_node_radius + 
                            this.node_radius + this.background_border}px`,
                        left: `${x_pos - this.clickable_node_radius + 
                            this.node_radius + this.background_border}px`,
                        background: 'transparent',
                        width: `${(this.clickable_node_radius) * 2}px`,
                        height: `${(this.clickable_node_radius) * 2}px`,
                    },
                    {
                        id: `clicknode_${this.id}_${i}_${j}`,
                        class: `node`,
                    }
                );
                let table = this;
                node.onmouseover = function () {
                    if (!table.busy) {
                        table.covered_node = [j, i];
                        table.update_colors();
                    }
                };
                node.onmouseout = function () {
                    table.covered_node = 0;
                    table.update_colors();
                };
            }
        }
        for (let i = 0; i < y; ++i) {
            for (let j = 0; j < x; ++j) {
                let table = this;
                this.clicknode(i, j).onclick = function () {
                    if (!table.busy) {
                        cf(j, i, table);
                    }
                };
            }
        }

        this.update_score();
        this.update_colors();
        this.node(this.start_point[1], this.start_point[0]).style.background = 
            this.start_node_color;
        this.node(this.end_point[1], this.end_point[0]).style.background = 
            this.end_node_color;
        this.update_background();
        this.onchange();
    }

    add_segment(x, y, animation = this.drawSegmentAnimation) {
        let last_x = this.points[this.lines_cnt][0];
        let last_y = this.points[this.lines_cnt][1];
        animation(this, 
            last_x * this.gridStep, last_y * this.gridStep, 
            x * this.gridStep, y * this.gridStep);
        this.points.push([x, y]);
        this.onchange();
        this.update_colors();
        this.update_score();
    }

    destroy_segments(x, y, animation = this.destroySegmentAnimation)
    {
        for (let n = 0; n < this.lines_cnt; ++n) {
            if (this.points[n][0] == x && this.points[n][1] == y) {
                animation(this, this.lines_cnt - n);
                return true;
            }
        }
        this.onchange()
        this.update_score();
        this.update_colors();
        return false;
    }
}
