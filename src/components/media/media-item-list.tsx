"use client";
import { useCallback, useEffect, useRef, useState } from "react";

interface ItemListProps<T> {
  items: T[];
  fetchItems: (offset: number, limit: number) => Promise<T[]>;
  renderItem: (item: T, index: number) => React.ReactNode;
  handleItemClick?: (item: T, index: number) => void;
  pageSize?: number;
}

export default function MediaItemList<T>({
  items,
  fetchItems,
  renderItem,
  handleItemClick,
  pageSize = 12,
}: ItemListProps<T>) {
  const [itemList, setItemList] = useState<T[]>(items);
  const [offset, setOffset] = useState(pageSize);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const loadMoreItems = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const newItems = await fetchItems(offset, pageSize);
      setItemList((prev) => [...prev, ...newItems]);
      if (newItems.length < pageSize) setHasMore(false);
      setOffset((prev) => prev + pageSize);
    } catch (error) {
      console.error("Failed to load more items:", error);
    } finally {
      setIsLoading(false);
    }
  }, [offset, pageSize, fetchItems, isLoading, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreItems();
        }
      },
      { threshold: 0.5 }
    );

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) observer.observe(currentObserverRef);

    return () => {
      if (currentObserverRef) observer.unobserve(currentObserverRef);
    };
  }, [loadMoreItems]);

  return (
    <div className="container mx-auto mt-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {itemList.map((item, index) => (
          <div
            key={index}
            onClick={() => handleItemClick?.(item, index)}
            className="flex flex-col overflow-hidden cursor-pointer"
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      <div ref={observerRef} className="py-10 text-center">
        {isLoading && (
          <div className="flex flex-col items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-400 border-t-transparent mb-6"></div>
          </div>
        )}
        {!hasMore && <p className="text-gray-400">더 이상 항목이 없습니다.</p>}
      </div>
    </div>
  );
}
