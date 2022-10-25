import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

export async function getElectionData() {
  const res = await fetch('potato');
  return res.json();
}