
interface PostContentProps {
  content: string;
  categoryName: string;
}

const PostContent = ({ content, categoryName }: PostContentProps) => {
  return (
    <div className="space-y-6">
      <div className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-500">
        {categoryName}
      </div>
      <div className="max-w-none text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
        {content}
      </div>
    </div>
  )
}

export default PostContent;
