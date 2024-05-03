import {TouchableOpacity} from "react-native";

const IconButton = ({onPress, icon, styles}) => (
    <TouchableOpacity style={styles} onPress={onPress}>
        {icon}
    </TouchableOpacity>
);


export default IconButton;