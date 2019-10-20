function cfKnightGame(x, y, table)
{
    if (table.destroy_segments(x, y, destroySegmentLinearAnimation)) {
        return;
    }
    for (let n = 1; n <= table.lines_cnt; n++) {
        if (segments_intersect(x, y, ...table.last_point,
            table.points[n - 1][0], table.points[n - 1][1],
            table.points[n][0], table.points[n][1])) {
            pulseNodeAnimation([256, 0, 0], 3000, 100000)(table.node(y, x));
            return;
        }
    }
    let last_point = table.last_point;
    if (squared_distance(x, y, last_point[0], last_point[1]) == 0) {
        return;
    }
    if (squared_distance(x, y, last_point[0], last_point[1]) == 5) {
        table.add_segment(x, y, drawSegmentLinearAnimation);
        return;
    }
    pulseNodeAnimation([256, 0, 0], 3000, 100000)(table.node(y, x));
}

function cfLengthenGame(x, y, table)
{
    if (table.destroy_segments(x, y, destroySegmentLinearAnimation)) {
        return;
    }
    for (let n = 1; n <= table.lines_cnt; n++) {
        if (segments_intersect(x, y, ...table.last_point,
            table.points[n - 1][0], table.points[n - 1][1],
            table.points[n][0], table.points[n][1])) {
            pulseNodeAnimation([256, 0, 0], 3000, 100000)(table.node(y, x));
            return;
        }
    }
    if (table.lines_cnt == 0) {
        table.add_segment(x, y, drawSegmentLinearAnimation);
        return;
    }
    let last_point = table.last_point;
    let prelast_point = table.points[table.points.length - 2];
    if (squared_distance(x, y, last_point[0], last_point[1]) > 
        squared_distance(last_point[0], last_point[1], prelast_point[0], prelast_point[1]))
    {
        table.add_segment(x, y, drawSegmentLinearAnimation);
        return;
    }
    pulseNodeAnimation([256, 0, 0], 3000, 100000)(table.node(y, x));
}
