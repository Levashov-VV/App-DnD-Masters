import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="flex flex-row w-100vw text-white text-2xl gap-50">
      <div className="w-1/6 ">
        <img className="w-1/2" src="/img/logo/logo.png" alt="Logo" />
      </div>
      <nav className="w-3/6 flex flex-row">
        <ul className="flex flex-row gap-10">
          <li>
            <Link to="/master/character">Создание персонажей</Link>
          </li>
          <li>
            <Link to="/master/diceTray">Броски кубика</Link>
          </li>
          <li>
            <Link to="/master/tables">Таблицы</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
