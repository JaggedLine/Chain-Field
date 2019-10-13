function cfKnightGame(x, y, table)
{
    if (table.destroy_segments(x, y, ChainField.destroySegmentLinearAnimation)) {
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
