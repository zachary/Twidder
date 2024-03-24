

interface buttonProps {
    text : string,
    color : string,
    loading : boolean,
    loadingText? : string
}
function Button({
    text,
    color,
    loadingText,
    loading
}: buttonProps) {
    return (
        <button className={`w-full text-lg rounded-sm text-white bg-${color}-500 py-2`} type="submit">{
            loading ? loadingText : text
        }</button>
    );
}

export default Button;