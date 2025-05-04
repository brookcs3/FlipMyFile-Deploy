import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import express from "express";

export async function registerRoutes(app: Express): Promise<Server> {
  // This application doesn't require backend routes as all conversion 
  // happens in the browser. The server just serves static files.
  
  // Add a health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0'
    });
  });
  
  // Add a route to serve our demo HTML
  app.get('/format-demo', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'format-transformation-demo.html'));
  });
  
  // Add a route for the FFmpeg format demo
  app.get('/ffmpeg-demo', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'scripts/enhanced-variant-generator/examples/ffmpeg-format-demo.html'));
  });
  
  // Add routes to serve our format transformation demo files
  app.use('/scripts', express.static('scripts'));
  
  // Add API endpoints for format conversion
  app.get('/api/formats', (req, res) => {
    // This would normally fetch from our format registry
    res.json({
      image: ['heic', 'jpg', 'png', 'webp', 'gif', 'svg', 'tiff', 'bmp', 'ico'],
      video: ['mp4', 'avi', 'webm', 'mkv', 'mov', 'flv', 'wmv', '3gp'],
      audio: ['mp3', 'wav', 'flac', 'ogg', 'aac', 'wma']
    });
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
