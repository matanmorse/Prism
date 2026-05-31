export default function EmulatorIcon({ emulatorName, size }) {
    const logos = import.meta.glob('../../static/icons/*.svg', { eager: true });
    const path = `../../static/icons/${emulatorName}-icon.svg`;
    const logo = logos[path]?.default || null;
    return <img className='emulator-logo' src={logo} style={{ height: size * 7.5 + 'px', width: size * 7.5 + 'px' }} />
}
