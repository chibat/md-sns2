/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { Head } from "$fresh/src/runtime/head.ts";

export default function Home() {
  return (
    <div>
      <Head>
        <title>md-sns</title>
      </Head>
      <nav class="{tw`flex justify-center space-x-4`}">
  <a href="/dashboard" class={tw`font-medium px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900`}>Home</a>
  <a href="/team" class={tw`font-medium px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900`}>Team</a>
  <a href="/projects" class={tw`font-medium px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900`}>Projects</a>
  <a href="/reports" class={tw`font-medium px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900`}>Reports</a>
</nav>
      <ul class={tw`flex`}>
        <li class={tw`mr-6`}>
          <a class={tw`text-blue-500 hover:text-blue-800`} href="#">Active</a>
        </li>
        <li class={tw`mr-6`}>
          <a class={tw`text-blue-500 hover:text-blue-800`} href="#">Link</a>
        </li>
        <li class={tw`mr-6`}>
          <a class={tw`text-blue-500 hover:text-blue-800`} href="#">Link</a>
        </li>
        <li class={tw`mr-6`}>
          <a class={tw`text-gray-400 cursor-not-allowed`} href="#">Disabled</a>
        </li>
      </ul>
      <a href="/counter">Counter</a>
    </div>
  );
}
