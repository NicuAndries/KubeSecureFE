import React, { useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Maximize, ChartBarStacked } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import * as d3 from 'd3';

const ClusterTopologyMap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { data, isLoading } = useQuery({
    queryKey: ['/api/dashboard/topology'],
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  const handleExpandView = () => {
    // Implementation for expanding the topology view
    console.log('Expand topology view');
  };

  // D3 visualization initialization and update
  useEffect(() => {
    if (isLoading || !data || !svgRef.current || !containerRef.current) return;
    
    const width = containerRef.current.clientWidth;
    const height = 400;
    
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);
      
    // Clear previous visualizations
    svg.selectAll('*').remove();
    
    // Initialize force simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.links).id((d: any) => d.id).distance(70))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2));
    
    // Add links
    const link = svg.append('g')
      .selectAll('line')
      .data(data.links)
      .enter()
      .append('line')
      .attr('stroke', (d: any) => d.suspicious ? '#F97316' : '#4B5563')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d: any) => d.suspicious ? 2 : 1);
    
    // Add nodes
    const nodeGroup = svg.append('g')
      .selectAll('g')
      .data(data.nodes)
      .enter()
      .append('g')
      .call(d3.drag<SVGGElement, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));
    
    // Add circles to node groups
    nodeGroup.append('circle')
      .attr('r', (d: any) => {
        switch (d.type) {
          case 'node': return 10;
          case 'pod': return 6;
          case 'service': return 7;
          default: return 5;
        }
      })
      .attr('fill', (d: any) => {
        switch (d.severity) {
          case 'critical': return '#EF4444';
          case 'high': return '#F97316';
          case 'medium': return '#FACC15';
          case 'low': return '#22C55E';
          default: return '#6D28D9';
        }
      })
      .attr('stroke', '#1E1E1E')
      .attr('stroke-width', 1.5);
      
    // Add labels to node groups
    nodeGroup.append('text')
      .attr('dx', 12)
      .attr('dy', 4)
      .attr('font-size', '8px')
      .attr('fill', '#E5E7EB')
      .text((d: any) => d.name);

    // Add tooltip behavior
    nodeGroup.append('title')
      .text((d: any) => `${d.name} (${d.type})`);
    
    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);
        
      nodeGroup.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });
    
    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    // Clean up simulation on unmount
    return () => {
      simulation.stop();
    };
  }, [data, isLoading]);

  return (
    <Card className="bg-bgdark-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Cluster Topology Map</h2>
          <div className="flex space-x-2">
            <Button
              onClick={handleExpandView}
              size="sm"
              className="bg-primary hover:bg-primary-dark"
            >
              <Maximize className="mr-1 h-4 w-4" />
              Expand
            </Button>
          </div>
        </div>
        
        <div className="topology-container relative h-[400px] bg-black/20 rounded-lg overflow-hidden" ref={containerRef}>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-4 bg-bgdark-lighter bg-opacity-80 rounded-lg">
                <ChartBarStacked className="mx-auto text-4xl mb-2 text-gray-400" />
                <p className="text-gray-300">Loading topology visualization...</p>
              </div>
            </div>
          ) : (
            <svg ref={svgRef} className="w-full h-full"></svg>
          )}
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-2 bg-gray-800 rounded text-xs">
            <span>Pod connections</span>
            <span className="font-medium">{data?.stats?.podConnections || 847}</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-800 rounded text-xs">
            <span>Suspicious connections</span>
            <span className="font-medium text-alert-high">{data?.stats?.suspiciousConnections || 6}</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-800 rounded text-xs">
            <span>Nodes</span>
            <span className="font-medium">{data?.stats?.nodes || 12}</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-800 rounded text-xs">
            <span>Services</span>
            <span className="font-medium">{data?.stats?.services || 28}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClusterTopologyMap;
