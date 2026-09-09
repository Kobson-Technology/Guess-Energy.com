'use client';

import Link from 'next/link';
import { Filter, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface Category {
  id: number;
  name: string;
  productCount: number;
}

interface MobileFiltersProps {
  categories: Category[];
  selectedCategoryId?: number;
  availableOnly: boolean;
  query: string;
}

export function MobileFilters({ categories, selectedCategoryId, availableOnly, query }: MobileFiltersProps) {
  const [openSection, setOpenSection] = useState<string | null>('categories');

  function toggle(section: string) {
    setOpenSection(openSection === section ? null : section);
  }

  return (
    <div className="filters-mobile">
      <button
        className="filters-toggle-btn"
        onClick={() => toggle('categories')}
        aria-expanded={openSection === 'categories'}
      >
        <Filter size={16} />
        <span>Filtrer et trier</span>
        <ChevronDown
          size={18}
          className={`chevron ${openSection === 'categories' ? 'rotated' : ''}`}
        />
      </button>

      {openSection === 'categories' && (
        <div className="filters-mobile-panel">
          <div className="filters-mobile-section">
            <h4>Catégories</h4>
            <Link
              href="/produits"
              className={`filters-mobile-link ${!selectedCategoryId ? 'is-active' : ''}`}
            >
              Toutes les catégories
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/produits?categoryId=${cat.id}`}
                className={`filters-mobile-link ${selectedCategoryId === cat.id ? 'is-active' : ''}`}
              >
                {cat.name}
                <span className="filters-mobile-count">{cat.productCount}</span>
              </Link>
            ))}
          </div>

          <div className="filters-mobile-section">
            <h4>Disponibilité</h4>
            <Link
              href={`/produits?available=1${query ? `&q=${encodeURIComponent(query)}` : ''}`}
              className={`filters-mobile-link ${availableOnly ? 'is-active' : ''}`}
            >
              <span className="filters-mobile-checkbox">
                <input type="checkbox" readOnly checked={availableOnly} />
              </span>
              En stock uniquement
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
