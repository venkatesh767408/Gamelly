import Blogs from "./Blogs"
import Hero from "./Hero"

const BlogMain=()=>{
    return(
        <div
             style={{ fontFamily: "'Montserrat', sans-serif" }}
      className="lg:min-h-screen max-w-7xl mx-auto px-1 sm:px-6 lg:px-8 pt-15 md:pt-10 md:py-0 sm:py-16 lg:py-20  relative overflow-hidden"
        >
            
            <Blogs/>

        </div>
    )
}

export default BlogMain