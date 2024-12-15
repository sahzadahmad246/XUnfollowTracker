import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Followers = () => {
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    axios
      .get('/api/followers', { withCredentials: true })
      .then(response => setFollowers(response.data.users))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Followers</h1>
      <ul>
        {followers.map(follower => (
          <li key={follower.id}>
            <img src={follower.profile_image_url} alt={follower.name} />
            <p>{follower.name} (@{follower.screen_name})</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Followers;
