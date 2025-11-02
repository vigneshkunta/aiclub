"use client";

export default function LandingPage() {
  return (
    <main>
      <header className="header">
        <h1 className="title">PoemVerse</h1>
        <p className="subtitle">Explore, Create, and Share Your Soulful Poems</p>
        <div className="cta">
          <a href="/explore" className="exploreBtn">Explore Poems</a>
          <a href="/generate" className="createBtn">Create Your Poem</a>
        </div>
      </header>

      <section className="features">
        <div className="featureCard">
          <h2>Discover</h2>
          <p>Explore thousands of public poems shared by passionate creators worldwide.</p>
        </div>
        <div className="featureCard">
          <h2>Create</h2>
          <p>Write your own poems effortlessly with our AI-assisted poem generator.</p>
        </div>
        <div className="featureCard">
          <h2>Save & Share</h2>
          <p>Save your favorite poems and share your masterpieces with the world.</p>
        </div>
      </section>

      <section className="heroImage">
        <div className="overlay">
          <h2>Let Words Flow Like Magic</h2>
        </div>
      </section>

      <style jsx>{`
        main {
          font-family: "Inter", sans-serif;
          color: #f0f4f8;
          background: linear-gradient(135deg, #1a1f2b, #111827);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* Header */
        .header {
          text-align: center;
          padding: 6rem 2rem 4rem 2rem;
          background: linear-gradient(135deg, #5a67d8, #7f9cf5);
          border-bottom-left-radius: 3rem;
          border-bottom-right-radius: 3rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          animation: fadeInDown 1s ease forwards;
        }

        .title {
          font-size: 4rem;
          font-weight: 800;
          background: linear-gradient(90deg, #fbbf24, #f472b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1rem;
        }

        .subtitle {
          font-size: 1.5rem;
          font-weight: 400;
          margin-bottom: 2.5rem;
          opacity: 0.85;
        }

        /* Call to action buttons */
        .cta {
          display: flex;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        a {
          text-decoration: none; /* REMOVE underline */
        }

        .exploreBtn,
        .createBtn {
          padding: 1rem 2rem;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 1.1rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .exploreBtn {
          background: #f472b6;
          color: white;
          box-shadow: 0 5px 15px rgba(244, 114, 182, 0.4);
        }

        .exploreBtn:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 10px 20px rgba(244, 114, 182, 0.5);
        }

        .createBtn {
          background: transparent;
          border: 2px solid #fbbf24;
          color: #fbbf24;
        }

        .createBtn:hover {
          background: #fbbf24;
          color: #111827;
          transform: translateY(-3px) scale(1.05);
        }

        /* Features section */
        .features {
          display: flex;
          justify-content: space-around;
          padding: 6rem 2rem;
          flex-wrap: wrap;
          gap: 3rem;
        }

        .featureCard {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 1.5rem;
          padding: 2rem;
          flex: 1 1 300px;
          max-width: 350px;
          backdrop-filter: blur(10px);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .featureCard:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 30px rgba(0, 0, 0, 0.5);
        }

        .featureCard h2 {
          font-size: 1.75rem;
          margin-bottom: 1rem;
          color: #fbbf24;
        }

        .featureCard p {
          font-size: 1rem;
          line-height: 1.6;
          opacity: 0.85;
        }

        /* Hero image */
        .heroImage {
          height: 400px;
          background: url("https://talkstar-assets.s3.amazonaws.com/production/playlists/playlist_697/2faeb8c7-26f4-47bf-98e1-0988079b8b0d/poetry_by_women_FB.jpg") center/cover no-repeat;
          position: relative;
          margin: 4rem 0;
          border-radius: 2rem;
          overflow: hidden;
        }

        .overlay {
          background: rgba(26, 32, 44, 0.6);
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
          color: #fbbf24;
          text-align: center;
          padding: 1rem 2rem;
        }

        @keyframes fadeInDown {
          0% {
            opacity: 0;
            transform: translateY(-50px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .header {
            padding: 4rem 1rem 3rem 1rem;
            border-radius: 2rem;
          }

          .title {
            font-size: 3rem;
          }

          .features {
            flex-direction: column;
            padding: 3rem 1rem;
          }

          .heroImage {
            height: 300px;
            margin: 2rem 0;
          }

          .overlay {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </main>
  );
}
