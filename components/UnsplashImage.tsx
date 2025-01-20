'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CACHE_KEY = 'unsplash_image';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface CachedImage {
  url: string;
  timestamp: number;
  photographerName: string;
  photographerUsername: string;
}

const filters = [
  'sepia(50%) contrast(120%) saturate(120%)',
  'grayscale(50%) brightness(110%)',
  'hue-rotate(45deg) contrast(110%) saturate(140%)',
  'invert(20%) sepia(20%) contrast(110%)',
  'blur(1px) brightness(105%) contrast(110%)',
  'saturate(150%) contrast(110%)',
  'hue-rotate(-45deg) brightness(105%) contrast(110%)',
  'sepia(30%) saturate(130%) contrast(110%)',
];

export function UnsplashImage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [photographer, setPhotographer] = useState<{
    name: string;
    username: string;
  } | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      const cachedImage = localStorage.getItem(CACHE_KEY);
      if (cachedImage) {
        const {
          url,
          timestamp,
          photographerName,
          photographerUsername,
        }: CachedImage = JSON.parse(cachedImage);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setImageUrl(url);
          setPhotographer({
            name: photographerName,
            username: photographerUsername,
          });
          return;
        }
      }

      try {
        const response = await fetch(
          'https://api.unsplash.com/photos/random?query=workspace&orientation=portrait',
          {
            headers: {
              Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
            },
          },
        );
        const data = await response.json();
        const newImageUrl = data.urls.regular;
        const photographerName = data.user.name;
        const photographerUsername = data.user.username;

        setImageUrl(newImageUrl);
        setPhotographer({
          name: photographerName,
          username: photographerUsername,
        });
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            url: newImageUrl,
            timestamp: Date.now(),
            photographerName,
            photographerUsername,
          }),
        );
      } catch (error) {
        console.error('Error fetching Unsplash image:', error);
      }
    };

    fetchImage();
  }, []);

  useEffect(() => {
    if (imageUrl) {
      const randomFilter = filters[Math.floor(Math.random() * filters.length)];
      setFilter(randomFilter);
    }
  }, [imageUrl]);

  if (!imageUrl) {
    return <div className="bg-gray-200 animate-pulse w-full h-full" />;
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <Image
        src={imageUrl || '/placeholder.svg'}
        alt="Workspace"
        layout="fill"
        objectFit="cover"
        className="rounded-r-lg transition-all duration-500"
        style={{ filter }}
      />
      {photographer && (
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          Photo by{' '}
          <Link
            href={`https://unsplash.com/@${photographer.username}?utm_source=thedevclub&utm_medium=referral`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-200"
          >
            {photographer.name}
          </Link>{' '}
          on{' '}
          <Link
            href="https://unsplash.com/?utm_source=thedevclub&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-200"
          >
            Unsplash
          </Link>
        </div>
      )}
    </div>
  );
}
