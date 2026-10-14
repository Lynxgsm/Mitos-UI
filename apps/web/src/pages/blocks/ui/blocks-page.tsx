import { SiteHeader } from "@/widgets/site-header";
import { BLOCKS, CATEGORIES } from "../model/blocks";
import { BlockPreview } from "./block-preview";

const slug = (category: string) => category.toLowerCase();

export function BlocksPage() {
  return (
    <div className="blocks">
      <SiteHeader />
      <main id="content" className="blocks-main">
        <header className="blocks-header">
          <h1>Blocks</h1>
          <p>
            Ready-made sections built only from Omni UI components, for React and Svelte. Copy the code into your
            app: no extra CSS, no extra dependency.
          </p>
          <nav aria-label="Block categories">
            <ul className="blocks-categories">
              {CATEGORIES.map((category) => (
                <li key={category}>
                  <a href={`#${slug(category)}`}>
                    {category}
                    <span className="blocks-count">{BLOCKS.filter((block) => block.category === category).length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        {CATEGORIES.map((category) => (
          <section key={category} className="blocks-category" aria-labelledby={slug(category)}>
            <h2 id={slug(category)}>{category}</h2>
            {BLOCKS.filter((block) => block.category === category).map((block) => (
              <BlockPreview key={block.id} {...block} />
            ))}
          </section>
        ))}
      </main>
    </div>
  );
}
