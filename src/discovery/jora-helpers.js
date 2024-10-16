export default {
    weight(current, prec = 1) {
        const unit = ['bytes', 'kB', 'MB', 'GB'];

        while (current > 1000) {
            current = current / 1000;
            unit.shift();
        }

        return current.toFixed(prec).replace(/\.0+$/, '') + unit[0];
    }
};
