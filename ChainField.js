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
        setProp('onresize', function(table) {});

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
        return this.gridStep * (this.sizeX - 1) + 
            2 * this.node_radius + 
            2 * this.background_border;
    }

    get height() {
        return this.gridStep * (this.sizeY - 1) + 
            2 * this.node_radius + 
            2 * this.background_border; 
    }

    get min_width() {
        return this.minGridStep * (this.sizeX - 1) + 
            2 * this.node_radius + 
            2 * this.background_border;
    }

    get min_height() {
        return this.minGridStep * (this.sizeY - 1) + 
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
                        width: `${(this.clickable_node_radius) * 2}px`,
                        height: `${(this.clickable_node_radius) * 2}px`,
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
        this.clickable_node_radius = Math.min(
            this.clickable_node_radius, this.gridStep / 2)

        this.update_positions();
        this.update_background();
    }

    tie_to_parent()
    {
        let table = this;
        document.body.onresize = function() {
            let parWidth = field.parentNode.clientWidth;
            let parHeight = field.parentNode.clientHeight;
            if (parHeight < table.min_height) {
                table.resize(parWidth, Infinity);
            }
            else {
                table.resize(parWidth, parHeight); 
            }
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

    generate_table(x, y, 
        start_point = [0, 0], end_point = [x - 1, y - 1],
        cf = cfKnightGame)
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

        this.tie_to_parent();
        this.update_score();
        this.update_colors();
        this.node(this.start_point[1], this.start_point[0]).style.background = 
            this.start_node_color;
        this.node(this.end_point[1], this.end_point[0]).style.background = 
            this.end_node_color;
        this.update_background();
        this.onchange();
    }

    add_segment(x, y, animation = drawSegmentAnimation) {
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

    destroy_segments(x, y, animation = destroySegmentAnimation)
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
