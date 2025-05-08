import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ChartBarStacked, 
  ZoomIn, 
  ZoomOut, 
  Filter, 
  RefreshCw,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import * as d3 from 'd3';

const Topology: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [namespace, setNamespace] = useState('all');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showPods, setShowPods] = useState(true);
  const [showServices, setShowServices] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [highlightThreats, setHighlightThreats] = useState(true);
  
  const { data, isLoading } = useQuery({
    queryKey: ['/api/topology', { namespace }],
    refetchInterval: 60000, // Refetch every minute
  });
  
  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel - 0.2, 0.5));
  };
  
  // D3 visualization initialization and update
  useEffect(() => {
    if (isLoading || !data || !svgRef.current || !containerRef.current) return;
    
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 600;
    
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);
      
    // Clear previous visualizations
    svg.selectAll('*').remove();
    
    // Create a group for all elements
    const g = svg.append('g');
    
    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 2])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
      
    // Apply zoom
    svg.call(zoom as any);
    svg.call(zoom.transform as any, d3.zoomIdentity.scale(zoomLevel));
    
    // Filter nodes based on UI toggles
    const filteredNodes = data.nodes.filter((node: any) => {
      if (node.type === 'pod' && !showPods) return false;
      if (node.type === 'service' && !showServices) return false;
      return true;
    });
    
    // Initialize force simulation
    const simulation = d3.forceSimulation(filteredNodes)
      .force('link', d3.forceLink(data.links).id((d: any) => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(30));
    
    // Create link groups
    const linkGroup = g.append('g')
      .attr('class', 'links')
      .selectAll('g')
      .data(data.links)
      .enter()
      .append('g');
    
    // Add links
    linkGroup.append('line')
      .attr('stroke', (d: any) => {
        if (d.suspicious && highlightThreats) return '#EF4444';
        return '#4B5563';
      })
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d: any) => (d.suspicious && highlightThreats) ? 2 : 1);
    
    // Add traffic indicators on links
    linkGroup.filter((d: any) => d.traffic)
      .append('circle')
      .attr('r', 3)
      .attr('fill', (d: any) => {
        if (d.suspicious && highlightThreats) return '#EF4444';
        return '#6D28D9';
      })
      .attr('class', 'traffic-indicator')
      .attr('opacity', 0.8);
    
    // Create node groups
    const nodeGroup = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(filteredNodes)
      .enter()
      .append('g')
      .call(d3.drag<SVGGElement, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));
    
    // Add node shapes based on type
    nodeGroup.each(function(d: any) {
      const node = d3.select(this);
      
      if (d.type === 'node') {
        node.append('rect')
          .attr('width', 20)
          .attr('height', 20)
          .attr('x', -10)
          .attr('y', -10)
          .attr('rx', 3)
          .attr('fill', '#6D28D9')
          .attr('stroke', '#1E1E1E')
          .attr('stroke-width', 1.5);
      } else if (d.type === 'pod') {
        node.append('circle')
          .attr('r', 6)
          .attr('fill', (d: any) => {
            if (!highlightThreats) return '#3B82F6';
            
            switch (d.severity) {
              case 'critical': return '#EF4444';
              case 'high': return '#F97316';
              case 'medium': return '#FACC15';
              case 'low': return '#22C55E';
              default: return '#3B82F6';
            }
          })
          .attr('stroke', '#1E1E1E')
          .attr('stroke-width', 1.5);
      } else if (d.type === 'service') {
        node.append('polygon')
          .attr('points', '0,-8 7,4 -7,4')
          .attr('fill', '#14B8A6')
          .attr('stroke', '#1E1E1E')
          .attr('stroke-width', 1.5);
      }
    });
    
    // Add labels to nodes if enabled
    if (showLabels) {
      nodeGroup.append('text')
        .attr('dx', 12)
        .attr('dy', 4)
        .attr('font-size', '10px')
        .attr('fill', '#E5E7EB')
        .text((d: any) => d.name);
    }

    // Add tooltip behavior
    nodeGroup.append('title')
      .text((d: any) => `${d.name} (${d.type})\n${d.namespace}`);
    
    // Update positions on simulation tick
    simulation.on('tick', () => {
      linkGroup.selectAll('line')
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);
      
      linkGroup.selectAll('.traffic-indicator')
        .attr('cx', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('cy', (d: any) => (d.source.y + d.target.y) / 2);
        
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
  }, [data, isLoading, zoomLevel, showPods, showServices, showLabels, highlightThreats]);

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center">
          <ChartBarStacked className="mr-3 h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Cluster Topology Map</h1>
        </div>
      </div>

      <Card className="bg-bgdark-card mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 justify-between">
            <div className="flex gap-2">
              <Select value={namespace} onValueChange={setNamespace}>
                <SelectTrigger className="w-40 bg-gray-800 border-gray-700">
                  <div className="flex items-center">
                    <Layers className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Namespace" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All namespaces</SelectItem>
                  <SelectItem value="default">default</SelectItem>
                  <SelectItem value="kube-system">kube-system</SelectItem>
                  <SelectItem value="monitoring">monitoring</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="bg-gray-800 border-gray-700 hover:bg-gray-700">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
              
              <Button variant="outline" className="bg-gray-800 border-gray-700 hover:bg-gray-700">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-pods"
                  checked={showPods}
                  onCheckedChange={setShowPods}
                />
                <Label htmlFor="show-pods">Pods</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-services"
                  checked={showServices}
                  onCheckedChange={setShowServices}
                />
                <Label htmlFor="show-services">Services</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-labels"
                  checked={showLabels}
                  onCheckedChange={setShowLabels}
                />
                <Label htmlFor="show-labels">Labels</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="highlight-threats"
                  checked={highlightThreats}
                  onCheckedChange={setHighlightThreats}
                />
                <Label htmlFor="highlight-threats">Highlight Threats</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-bgdark-card">
        <CardContent className="p-4">
          <div className="topology-container relative h-[600px] bg-black/20 rounded-lg overflow-hidden" ref={containerRef}>
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
            
            <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
              <Button
                variant="secondary"
                size="icon"
                className="bg-gray-800 hover:bg-gray-700"
                onClick={handleZoomIn}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="bg-gray-800 hover:bg-gray-700"
                onClick={handleZoomOut}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-gray-800 rounded-lg">
              <h3 className="text-sm font-medium mb-1">Nodes</h3>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary rounded-sm mr-2"></div>
                  <span className="text-xs text-gray-300">Kubernetes Nodes</span>
                </div>
                <span className="text-sm font-medium">{data?.stats?.nodes || 12}</span>
              </div>
            </div>
            
            <div className="p-3 bg-gray-800 rounded-lg">
              <h3 className="text-sm font-medium mb-1">Pods</h3>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-xs text-gray-300">Running Containers</span>
                </div>
                <span className="text-sm font-medium">{data?.stats?.pods || 86}</span>
              </div>
            </div>
            
            <div className="p-3 bg-gray-800 rounded-lg">
              <h3 className="text-sm font-medium mb-1">Services</h3>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-teal-500 clip-triangle mr-2"></div>
                  <span className="text-xs text-gray-300">Network Services</span>
                </div>
                <span className="text-sm font-medium">{data?.stats?.services || 28}</span>
              </div>
            </div>
            
            <div className="p-3 bg-gray-800 rounded-lg">
              <h3 className="text-sm font-medium mb-1">Threats</h3>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-alert-critical rounded-full mr-2"></div>
                  <span className="text-xs text-gray-300">Security Issues</span>
                </div>
                <span className="text-sm font-medium">{data?.stats?.threatCount || 12}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Topology;
