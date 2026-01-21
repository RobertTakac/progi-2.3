export default function UserProfileCard({ name, address, email }) {
  return (
    <div className="profile-card">
      <h2>{name}</h2>
      <p>{address}</p>
      <p>{email}</p>
    </div>
  );
}
