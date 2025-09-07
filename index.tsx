import React, { useState, useCallback, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

type AdSurface = 'billboard' | 'newspaper' | 'magazine' | 'bus_stop' | 'social_media' | 'auto_rickshaw' | 'wall_poster' | 'mall_standee' | 'kirana_store' | 'roadside_hoarding' | 'metro_train' | 'digital_kiosk';

interface SurfaceOption {
  id: AdSurface;
  label: string;
  emoji: string;
  prompt: string;
  previewImage: string;
}

const surfaces: SurfaceOption[] = [
    {
        id: 'billboard',
        label: 'Billboard',
        emoji: '🏙️',
        prompt: 'Place the uploaded product image onto a large, modern billboard in a Nighttime Indian city intersection with light-trail traffic and rain-kissed asphalt. The ad should look photorealistic.',
        previewImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIGZpbGw9IiNmZmZmZmYiLz48cmVjdCB4PSIxOCIgeT0iMTgiIHdpZHRoPSI5MiIgaGVpZ2h0PSI0NiIgcng9IjYiIGZpbGw9IiNGOUZBRkIiIHN0cm9rZT0iI0U1RTdFQiIgc3Ryb2tlLXdpZHRoPSI0Ii8+PHJlY3QgeD0iNTgiIHk9IjY0IiB3aWR0aD0iMTIiIGhlaWdodD0iMzAiIGZpbGw9IiNFNUU3RUIiLz48cmVjdCB4PSIyOCIgeT0iMjYiIHdpZHRoPSI3MiIgaGVpZ2h0PSIzMCIgcng9IjQiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iI0U1RTdFQiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+'
    },
    {
        id: 'newspaper',
        label: 'Newspaper',
        emoji: '📰',
        prompt: 'Place the uploaded product image into a full-page, high-quality print advertisement in a classic newspaper layout. The text should be placeholder lorem ipsum.',
        previewImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIGZpbGw9IiNmZmZmZmYiLz48cmVjdCB4PSIxOCIgeT0iMjIiIHdpZHRoPSI5MiIgaGVpZ2h0PSI4NCIgcng9IjYiIGZpbGw9IiNGOUZBRkIiIHN0cm9rZT0iI0U1RTdFQiIgc3Ryb2tlLXdpZHRoPSI0Ii8+PHJlY3QgeD0iMjYiIHk9IjMwIiB3aWR0aD0iMjYiIGhlaWdodD0iMjIiIHJ4PSIzIiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiNFNUU3RUIiIHN0cm9rZS13aWR0aD0iMiIvPjxyZWN0IHg9IjU2IiB5PSIzMCIgd2lkdGg9IjQ2IiBoZWlnaHQ9IjYiIHJ4PSIyIiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiNFNUU3RUIiIHN0cm9rZS13aWR0aD0iMiIvPjxyZWN0IHg9IjU2IiB5PSI0MCIgd2lkdGg9IjQ2IiBoZWlnaHQ9IjYiIHJ4PSIyIiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiNFNUU3RUIiIHN0cm9rZS13aWR0aD0iMiIvPjxyZWN0IHg9IjI2IiB5PSI1OCIgd2lkdGg9Ijc2IiBoZWlnaHQ9IjEwIiByeD0iMiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjRTVFN0VCIiBzdHJva2Utd2lkdGg9IjIiLz48cmVjdCB4PSIyNiIgeT0iNzIiIHdpZHRoPSI3NiIgaGVpZ2h0PSI2IiByeD0iMiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjRTVFN0VCIiBzdHJva2Utd2lkdGg9IjIiLz48cmVjdCB4PSIyNiIgeT0iODIiIHdpZHRoPSI3NiIgaGVpZ2h0PSI2IiByeD0iMiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjRTVFN0VCIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4='
    },
    {
        id: 'magazine',
        label: 'Magazine',
        emoji: '📖',
        prompt: 'Photo of the product featured in a glossy, full-page advertisement in a high-fashion magazine, with surrounding editorial text and images. Soft studio lighting, slight paper curl, rich ink shine, premium editorial feel, photoreal.',
        previewImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIGZpbGw9IiNmZmZmZmYiLz48cmVjdCB4PSIxOCIgeT0iMjQiIHdpZHRoPSI5MiIgaGVpZ2h0PSI4MCIgcng9IjYiIGZpbGw9IiNGOUZBRkIiIHN0cm9rZT0iI0U1RTdFQiIgc3Ryb2tlLXdpZHRoPSI0Ii8+PGxpbmUgeDE9IjY0IiB5MT0iMjYiIHgyPSI2NCIgeTI9IjEwMiIgc3Ryb2tlPSIjRTVFN0VCIiBzdHJva2Utd2lkdGg9IjIiLz48cmVjdCB4PSIyNiIgeT0iMzQiIHdpZHRoPSIzMCIgaGVpZ2h0PSI1MCIgcng9IjQiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iI0U1RTdFQiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHJlY3QgeD0iNzIiIHk9IjM0IiB3aWR0aD0iMzAiIGhlaWdodD0iNTAiIHJ4PSI0IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiNFNUU3RUIiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg=='
    },
    {
        id: 'bus_stop',
        label: 'Bus Stop',
        emoji: '🚌',
        prompt: 'Place the uploaded product image onto a brightly lit digital ad panel at a clean, modern bus stop on a an Indian city street at dusk. Three-quarter angle, commuters slightly blurred, wet pavement reflections, photoreal.',
        previewImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIGZpbGw9IiNmZmZmZmYiLz48cmVjdCB4PSIxOCIgeT0iNDQiIHdpZHRoPSI5MiIgaGVpZ2h0PSI0OCIgcng9IjYiIGZpbGw9IiNGOUZBRkIiIHN0cm9rZT0iI0U1RTdFQiIgc3Ryb2tlLXdpZHRoPSI0Ii8+PHJlY3QgeD0iMjIiIHk9IjMyIiB3aWR0aD0iODQiIGhlaWdodD0iOCIgcng9IjIiIGZpbGw9IiNFNUU3RUIiLz48cmVjdCB4PSIyOCIgeT0iNTAiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzNiIgcng9IjQiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iI0U1RTdFQiIgc3Ryb2tlLXdpZHRoPSIyIi8+PGxpbmUgeDE9IjIyIiB5MT0iNDQiIHgyPSIyMiIgeTI9IjEwMCIgc3Ryb2tlPSIjRTVFN0VCIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxsaW5lIHgxPSIxMDYiIHkxPSI0NCIgeDI9IjEwNiIgeTI9IjEwMCIgc3Ryb2tlPSIjRTVFN0VCIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvc3ZnPg=='
    },
    {
        id: 'social_media',
        label: 'Social Media',
        emoji: '📱',
        prompt: 'Place the uploaded product image into a stylish, engaging social media feed post, formatted for a platform like Instagram. Include some likes and a generic caption. A smartphone screen displaying it',
        previewImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIGZpbGw9IiNmZmZmZmYiLz48cmVjdCB4PSIzNCIgeT0iMTgiIHdpZHRoPSI2MCIgaGVpZ2h0PSI5NiIgcng9IjEwIiBmaWxsPSIjRjlGQUZCIiBzdHJva2U9IiNFNUU3RUIiIHN0cm9rZS13aWR0aD0iNCIvPjxyZWN0IHg9IjQyIiB5PSIzNCIgd2lkdGg9IjQ0IiBoZWlnaHQ9IjEwIiByeD0iMyIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjRTVFN0VCIiBzdHJva2Utd2lkdGg9IjIiLz48cmVjdCB4PSI0MiIgeT0iNTAiIHdpZHRoPSI0NCIgaGVpZ2h0PSIzMCIgcng9IjQiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iI0U1RTdFQiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHJlY3QgeD0iNDIiIHk9Ijg0IiB3aWR0aD0iMTgiIGhlaWdodD0iOCIgcng9IjIiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iI0U1RTdFQiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHJlY3QgeD0iNjYiIHk9Ijg0IiB3aWR0aD0iMjAiIGhlaWdodD0iOCIgcng9IjIiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iI0U1RTdFQiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+'
    },
    {
        id: 'auto_rickshaw',
        label: 'Auto Rickshaw',
        emoji: '🛺',
        prompt: 'Place the uploaded product image onto an advertisement panel on the back of a classic Indian auto rickshaw (tuk-tuk) navigating a busy street in Mumbai.',
        previewImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIGZpbGw9IiNmZmZmZmYiLz48cmVjdCB4PSIyNSIgeT0iMzQiIHdpZHRoPSI3OCIgaGVpZ2h0PSI2MCIgcng9IjEwIiBmaWxsPSIjRjlGQUZCIiBzdHJva2U9IiNFNUU3RUIiIHN0cm9rZS13aWR0aD0iNCIvPjxyZWN0IHg9IjQ2IiB5PSI0NiIgd2lkdGg9IjM2IiBoZWlnaHQ9IjMwIiByeD0iNCIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjRTVFN0VCIiBzdHJva2Utd2lkdGg9IjIiLz48Y2lyY2xlIGN4PSI0MiIgY3k9Ijk4IiByPSI2IiBmaWxsPSIjRTVFN0VCIi8+PGNpcmNsZSBjeD0iODYiIGN5PSI5OCIgcj0iNiIgZmlsbD0iI0U1RTdFQiIvPjwvc3ZnPg=='
    },
    {
        id: 'wall_poster',
        label: 'Wall Poster',
        emoji: '🧱',
        prompt: 'Place the uploaded product image onto a large, slightly weathered poster pasted onto a colorful, textured brick wall on a street in Delhi, India.',
        previewImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIGZpbGw9IiNmZmZmZmYiLz48cmVjdCB4PSIxOCIgeT0iMTgiIHdpZHRoPSI5MiIgaGVpZ2h0PSI5MiIgcng9IjYiIGZpbGw9IiNGOUZBRkIiIHN0cm9rZT0iI0U1RTdFQiIgc3Ryb2tlLXdpZHRoPSI0Ii8+PHJlY3QgeD0iMzQiIHk9IjM0IiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHJ4PSI0IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiNFNUU3RUIiIHN0cm9rZS13aWR0aD0iMiIvPjxyZWN0IHg9IjQwIiB5PSIyOCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjYiIGZpbGw9IiNFNUU3RUIiLz48cmVjdCB4PSI3NiIgeT0iMjgiIHdpZHRoPSIxMiIgaGVpZ2h0PSI2IiBmaWxsPSIjRTVFN0VCIi8+PC9zdmc+'
    },
    {
        id: 'mall_standee',
        label: 'Mall Standee',
        emoji: '🛍️',
        prompt: 'Place the uploaded product image onto a sleek, vertical standee banner inside a modern, bustling shopping mall in Bangalore, India, with shoppers in the background.',
        previewImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIGZpbGw9IiNmZmZmZmYiLz48cmVjdCB4PSIzNCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI4OCIgcng9IjYiIGZpbGw9IiNGOUZBRkIiIHN0cm9rZT0iI0U1RTdFQiIgc3Ryb2tlLXdpZHRoPSI0Ii8+PHJlY3QgeD0iNDAiIHk9IjI4IiB3aWR0aD0iNDgiIGhlaWdodD0iNzIiIHJ4PSI0IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiNFNUU3RUIiIHN0cm9rZS13aWR0aD0iMiIvPjxyZWN0IHg9IjMwIiB5PSIxMTAiIHdpZHRoPSI2OCIgaGVpZ2h0PSI2IiByeD0iMyIgZmlsbD0iI0U1RTdFQiIvPjwvc3ZnPg=='
    },
    {
        id: 'kirana_store',
        label: 'Kirana Store',
        emoji: '🏪',
        prompt: 'Place the uploaded product image onto a prominent banner hanging outside a charming, busy local Kirana (neighborhood grocery) store in a residential area of India.',
        previewImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAxMjggMTI4JyB3aWR0aD0nMTI4JyBoZWlnaHQ9JzEyOCc+PHJlY3Qgd2lkdGg9JzEyOCcgaGVpZ2h0PScxMjgnIGZpbGw9JyNmZmYnLz48cmVjdCB4PScxOCcgeT0nMjQnIHdpZHRoPSc5MicgaGVpZ2h0PSc4MCcgcng9JzYnIGZpbGw9JyNGOUZBRkInIHN0cm9rZT0nI0U1RTdFQicgc3Ryb2tlLXdpZHRoPSc0Jy8+PHJlY3QgeD0nMjQnIHk9JzMwJyB3aWR0aD0nODAnIGhlaWdodD0nMTQnIHJ4PSczJyBmaWxsPScjZmZmJyBzdHJva2U9JyNFNUU3RUInIHN0cm9rZS13aWR0aD0nMicvPjxsaW5lIHgxPSc0MCcgeTE9JzMwJyB4Mj0nNDAnIHkyPSc0NCcgc3Ryb2tlPScjRTVFN0VCJyBzdHJva2Utd2lkdGg9JzInLz48bGluZSB4MT0nNTYnIHkxPSczMCcgeDI9JzU2JyB5Mj0nNDQnIHN0cm9rZT0nI0U1RTdFQicgc3Ryb2tlLXdpZHRoPScyJy8+PGxpbmUgeDE9JzcyJyB5MT0nMzAnIHgyPSc3MicgeTI9JzQ0JyBzdHJva2U9JyNFNUU3RUInIHN0cm9rZS13aWR0aD0nMicvPjxsaW5lIHgxPSc4OCcgeTE9JzMwJyB4Mj0nODgnIHkyPSc0NCcgc3Ryb2tlPScjRTVFN0VCJyBzdHJva2Utd2lkdGg9JzInLz48cmVjdCB4PScyNCcgeT0nNTAnIHdpZHRoPSc4MCcgaGVpZ2h0PSc0NCcgcng9JzMnIGZpbGw9JyNmZmYnIHN0cm9rZT0nI0U1RTdFQicgc3Ryb2tlLXdpZHRoPScyJy8+PGxpbmUgeDE9JzI0JyB5MT0nNjYnIHgyPScxMDQnIHkyPSc2Nicgc3Ryb2tlPScjRTVFN0VCJyBzdHJva2Utd2lkdGg9JzInLz48bGluZSB4MT0nMjQnIHkxPSc4MicgeDI9JzEwNCcgeTI9JzgyJyBzdHJva2U9JyNFNUU3RUInIHN0cm9rZS13aWR0aD0nMicvPjwvc3ZnPg=='
    },
    {
        id: 'roadside_hoarding',
        label: 'Roadside',
        emoji: '🛣️',
        prompt: 'Place the uploaded product image onto a massive roadside hoarding next to a busy highway with clear blue skies.',
        previewImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIGZpbGw9IiNmZmZmZmYiLz48cmVjdCB4PSIxOCIgeT0iMTgiIHdpZHRoPSI5MiIgaGVpZ2h0PSI0MCIgcng9IjYiIGZpbGw9IiNGOUZBRkIiIHN0cm9rZT0iI0U1RTdFQiIgc3Ryb2tlLXdpZHRoPSI0Ii8+PHJlY3QgeD0iMjYiIHk9IjI0IiB3aWR0aD0iNzYiIGhlaWdodD0iMjgiIHJ4PSI0IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiNFNUU3RUIiIHN0cm9rZS13aWR0aD0iMiIvPjxyZWN0IHg9IjYwIiB5PSI1OCIgd2lkdGg9IjgiIGhlaWdodD0iNDAiIGZpbGw9IiNFNUU3RUIiLz48L3N2Zz4='
    },
    {
        id: 'metro_train',
        label: 'Metro Train',
        emoji: '🚇',
        prompt: 'Place the uploaded product image onto a horizontal ad panel inside a modern, clean metro train cabin, above the windows.',
        previewImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIGZpbGw9IiNmZmZmZmYiLz48cmVjdCB4PSIxOCIgeT0iMjIiIHdpZHRoPSI5MiIgaGVpZ2h0PSI4NCIgcng9IjYiIGZpbGw9IiNGOUZBRkIiIHN0cm9rZT0iI0U1RTdFQiIgc3Ryb2tlLXdpZHRoPSI0Ii8+PHJlY3QgeD0iMjYiIHk9IjMwIiB3aWR0aD0iMzAiIGhlaWdodD0iMjIiIHJ4PSIzIiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiNFNUU3RUIiIHN0cm9rZS13aWR0aD0iMiIvPjxyZWN0IHg9IjY2IiB5PSIzMCIgd2lkdGg9IjM2IiBoZWlnaHQ9IjUyIiByeD0iNCIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjRTVFN0VCIiBzdHJva2Utd2lkdGg9IjIiLz48bGluZSB4MT0iNDEiIHkxPSI1MiIgeDI9IjQxIiB5Mj0iMTA2IiBzdHJva2U9IiNFNUU3RUIiIHN0cm9rZS13aWR0aD0iNCIvPjxjaXJjbGUgY3g9IjQxIiBjeT0iNTYiIHI9IjQiIGZpbGw9IiNFNUU3RUIiLz48L3N2Zz4='
    },
    {
        id: 'digital_kiosk',
        label: 'Digital Kiosk',
        emoji: '🖥️',
        prompt: 'Place the uploaded product image onto a bright, vertical digital kiosk screen on a modern city sidewalk.',
        previewImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIGZpbGw9IiNmZmZmZmYiLz48cmVjdCB4PSIzNCIgeT0iMTYiIHdpZHRoPSI2MCIgaGVpZ2h0PSI5NiIgcng9IjEwIiBmaWxsPSIjRjlGQUZCIiBzdHJva2U9IiNFNUU3RUIiIHN0cm9rZS13aWR0aD0iNCIvPjxyZWN0IHg9IjQyIiB5PSIyOCIgd2lkdGg9IjQ0IiBoZWlnaHQ9IjcyIiByeD0iNiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjRTVFN0VCIiBzdHJva2Utd2lkdGg9IjIiLz48cmVjdCB4PSI0NiIgeT0iMTE0IiB3aWR0aD0iMzYiIGhlaWdodD0iNiIgcng9IjMiIGZpbGw9IiNFNUU3RUIiLz48L3N2Zz4='
    }
];

type Theme = 'light' | 'dark';

const App = () => {
  const [productImage, setProductImage] = useState<{ b64: string; mimeType: string } | null>(null);
  const [selectedSurface, setSelectedSurface] = useState<SurfaceOption | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>('light');
  const [isDragging, setIsDragging] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsInfoModalOpen(false);
      }
    };

    if (isInfoModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isInfoModalOpen]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const processFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
        setError("Please upload a valid image file.");
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      setProductImage({ b64: base64String, mimeType: file.type });
      setGeneratedImage(null);
      setGeneratedText(null);
      setError(null);
    };
    reader.onerror = () => {
        setError("Failed to read the file.");
    }
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemoveImage = () => {
    setProductImage(null);
    const uploadInput = document.getElementById('image-upload') as HTMLInputElement;
    if(uploadInput) uploadInput.value = '';
  };

  const handleGenerate = useCallback(async () => {
    if (!productImage || !selectedSurface) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setGeneratedText(null);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
          parts: [
            {
              inlineData: {
                data: productImage.b64,
                mimeType: productImage.mimeType,
              },
            },
            {
              text: selectedSurface.prompt,
            },
          ],
        },
        config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
      });

      const parts = response.candidates?.[0]?.content?.parts || [];
      const imagePart = parts.find((part) => part.inlineData);
      const textPart = parts.find((part) => part.text);

      if (textPart?.text) {
        setGeneratedText(textPart.text);
      }

      if (imagePart?.inlineData) {
        const mimeType = imagePart.inlineData.mimeType || 'image/png';
        setGeneratedImage(`data:${mimeType};base64,${imagePart.inlineData.data}`);
      } else {
        const errorMessage = textPart?.text
          ? `The model returned a message instead of an image: "${textPart.text}"`
          : 'No image was generated. Please try again.';
        throw new Error(errorMessage);
      }
    } catch (e) {
      console.error(e);
      setError(`An error occurred: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [productImage, selectedSurface]);

  const handleDownload = () => {
    if (!generatedImage || !selectedSurface) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `ad-visualizer-${selectedSurface.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <>
      <main>
        <div className="controls-panel">
          <header>
            <div className="title-group">
              <h1>📸 Ad Visualizer</h1>
              <button onClick={() => setIsInfoModalOpen(true)} className="info-toggle" aria-label="Show help information">
              ?
              </button>
            </div>
            <button onClick={toggleTheme} className="theme-toggle" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </header>
          
          <div className="card">
            <h2>1. Upload Product Image</h2>
            <input type="file" id="image-upload" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            {!productImage ? (
              <label 
                htmlFor="image-upload" 
                className={`upload-area ${isDragging ? 'dragging' : ''}`}
                role="button" 
                aria-label="Upload an image"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <span>📤</span> Click or drag to upload
              </label>
            ) : (
              <div className="image-preview">
                <img src={`data:${productImage.mimeType};base64,${productImage.b64}`} alt="Product preview" />
                <button onClick={handleRemoveImage} className="remove-image-btn" aria-label="Remove image">
                  ❌
                </button>
              </div>
            )}
          </div>

          <div className="card">
            <h2>2. Choose Ad Surface</h2>
            <div className="surface-selector">
              {surfaces.map((surface) => (
                <button
                  key={surface.id}
                  className={`surface-card ${selectedSurface?.id === surface.id ? 'selected' : ''}`}
                  onClick={() => setSelectedSurface(surface)}
                  aria-pressed={selectedSurface?.id === surface.id}
                >
                  <img src={surface.previewImage} alt={surface.label} className="surface-preview-image"/>
                  <div className="surface-label">
                    <span aria-hidden="true">{surface.emoji}</span>
                    <span>{surface.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            className="action-button"
            onClick={handleGenerate}
            disabled={!productImage || !selectedSurface || isLoading}
          >
            ✨ Visualize!
          </button>
        </div>

        <div className="result-panel">
          {isLoading && <div className="loader" aria-label="Loading"></div>}
          {error && <div className="error" role="alert">{error}</div>}
          {!isLoading && !error && generatedImage && (
            <div className="result-content">
              <img src={generatedImage} alt={`Product visualized on a ${selectedSurface?.label}`} />
              {generatedText && <p className="result-description">{generatedText}</p>}
              <button className="action-button" onClick={handleDownload}>
                💾 Download Image
              </button>
            </div>
          )}
          {!isLoading && !error && !generatedImage && (
            <div className="result-placeholder">
              <div className="result-placeholder-icon">🖼️</div>
              <p>Your ad visualization will appear here.</p>
            </div>
          )}
        </div>
      </main>

      {isInfoModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsInfoModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="info-modal-title">
            <div className="modal-header">
              <h2 id="info-modal-title">How to Use Ad Visualizer</h2>
              <button onClick={() => setIsInfoModalOpen(false)} className="close-modal-btn" aria-label="Close help information">
                &times;
              </button>
            </div>
            <div className="modal-body">
              <ol>
                <li><strong>Upload an Image:</strong> Click or drag & drop your product image into the upload area.</li>
                <li><strong>Choose a Surface:</strong> Select where you want to place your ad, like a billboard or a magazine.</li>
                <li><strong>Visualize:</strong> Hit the "✨ Visualize!" button to let the AI generate your ad concept.</li>
                <li><strong>Download:</strong> Once the image is generated, you can download it using the "💾 Download Image" button.</li>
              </ol>
              <div className="dinfo">
                Built with Gemini 2.5 Flash image (nano-banana) by <a href="https://x.com/drashyakuruwa" target="_blank" rel="noopener noreferrer">@drashyakuruwa</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);