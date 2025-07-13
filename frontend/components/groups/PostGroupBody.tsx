export default function PostGroupBody({
  title,
  content,
  media,
 
}: {
  title: string;
  content: string;
  media: string;
  
}) {
  let baseMediaPath =  "http://localhost:8080/images/groupePost/" 

  return (
    <div className="post-body">
      <h2>{title}</h2>
      <p>{content}</p>

      {media &&  (
        <img src={baseMediaPath+media} alt={title} className="postImg" />
      )}
    </div>
  );
}
