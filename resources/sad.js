(function($) {

    $.fn.sad = function() {
        this.config = {
            loadFromDefinition: null,
            loadFromUrl: null
        };
        this.container = $(this);
        var that = this;
        $.getScript('//d3js.org/d3.v3.min.js', function(script, textStatus, jqXHR) {
            var data = { "id": "1", "desc": "Executive office", "children": [{ "id": "2", "desc": "Sales", "hasChild": true }, { "id": "3", "desc": "Marketing", "hasChild": true }, { "id": "4", "desc": "Development", "hasChild": true }] }

            var links = [
                { source: "Web Server", target: "Load Balancer", type: "licensing" },
                { source: "Load Balancer", target: "App Server", type: "licensing" },
                { source: "App Server", target: "DataPower", type: "suit" },
                { source: "DataPower", target: "AppServer", type: "resolved" },
                { source: "App DB", target: "App Server", type: "suit" },
                { source: "App Server", target: "App DB", type: "suit" },
                { source: "DataPower", target: "CICS", type: "suit" },
                { source: "CICS", target: "DataPower", type: "suit" },
                { source: "CICS", target: "Biz Apps", type: "suit" },
                { source: "App Server", target: "SSO", type: "suit" },
                { source: "SSO", target: "App Server", type: "suit" },
                { source: "SSO", target: "LDAP", type: "suit" }
            ];

            var nodes = {};
            // Compute the distinct nodes from the links.
            links.forEach(function(link) {
                link.source = nodes[link.source] || (nodes[link.source] = { name: link.source });
                link.target = nodes[link.target] || (nodes[link.target] = { name: link.target });
            });

            var width = 960,
                height = 500;

            var force = d3.layout.force()
                .nodes(d3.values(nodes))
                .links(links)
                .size([width, height])
                .linkDistance(300)
                .charge(-300)
                .on("tick", tick)
                .start();

            var svg = d3.select($(that)[0]).append("svg")
                .attr("width", width)
                .attr("height", height);

            // Per-type markers, as they don't inherit styles.
            svg.append("defs").selectAll("marker")
                .data(["suit", "licensing", "resolved"])
                .enter().append("marker")
                .attr("id", function(d) { return d; })
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 15)
                .attr("refY", -1.5)
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
                .append("path")
                .attr("d", "M0,-5L10,0L0,5");

            var path = svg.append("g").selectAll("path")
                .data(force.links())
                .enter().append("path")
                .attr("class", function(d) { return "link " + d.type; })
                .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });

            var rect = svg.append("g").selectAll("rect")
                .data(force.nodes())
                .enter().append("rect")
                .attr("width", 60)
                .attr("height", 40)
                .call(force.drag);

            var text = svg.append("g").selectAll("text")
                .data(force.nodes())
                .enter().append("text")
                .attr("x", 2)
                .attr("y", "2em")
                .text(function(d) { return d.name; });

            // Use elliptical arc path segments to doubly-encode directionality.
            function tick() {
                path.attr("d", linkArc);
                rect.attr("transform", transform);
                text.attr("transform", transform);
            }

            function linkArc(d) {
                var dx = d.target.x - d.source.x,
                    dy = d.target.y - d.source.y,
                    dr = 0;
                return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
            }

            function transform(d) {
                return "translate(" + d.x + "," + d.y + ")";
            }
            return this;
        }).fail(function(jqxhr, settings, exception) {
            throw 'Failed to load D3! Make sure //d3js.org/d3.v3.min.js is accessible';
        });
    };

}(jQuery));