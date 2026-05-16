import '../../styles/EmulatorIconList.css';
const EmulatorIconList = ({emulatorNameList}) => {
    const logos = import.meta.glob('../../../static/icons/*.svg', { eager: true });

    return (
        <div className="emulator-icon-list">
            {emulatorNameList.map((emulatorName) => (
                    <img key={emulatorName} src={logos[`../../../static/icons/${emulatorName}-icon.svg`].default || null} alt={`${emulatorName} icon`} className="emulator-icon" />
            ))}
        </div>
    );
}

export default EmulatorIconList;