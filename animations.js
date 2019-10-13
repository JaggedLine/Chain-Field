function drawSegmentAnimation(table, x1, y1, x2, y2)
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

function drawSegmentLinearAnimation(table, x1, y1, x2, y2)
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

function drawSegmentAlexAnimation(table, x1, y1, x2, y2)
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

function destroySegmentAnimation(table, N)
{
    segments.removeChild(table.segment(table.lines_cnt - 1));
    table.points.pop();
    table.update_score();
    table.update_colors();
    table.onchange();
    if (N > 1) { 
        destroySegmentAnimation(table, N - 1);
    }
}

function destroySegmentLinearAnimation(table, N, _past = 0)
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
                destroySegmentLinearAnimation(
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

function destroySegmentAlexAnimation(table, N)
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
                destroySegmentAlexAnimation(table, N - 1);
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

function pulseNodeAnimation(color, time, finalRadius)
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
